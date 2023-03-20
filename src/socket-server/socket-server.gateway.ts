import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { CreateMessageRequestDto } from 'src/messages/dto/create-message.request.dto';
import { JwtService } from '@nestjs/jwt';
import { SocketClient } from './interfaces/socket-client.interface';
import {
  ESocketEvents,
  ISocketEventUserConnected,
} from './interfaces/socket-events.interface';
import { User } from '../db/interfaces/user.interface';
import { Room } from '../db/interfaces/room.interface';
import { MessagesService } from 'src/messages/messages.service';
import { UserService } from 'src/user/user.service';
import { RoomQueryService } from 'src/db/services/room.query.service';
import { PushService } from 'src/push/push.service';

const SOCKET_PORT = () => parseInt(process.env.SOCKET_PORT || '9015');

@WebSocketGateway(SOCKET_PORT())
export class SocketServerGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger(SocketServerGateway.name);

  private connections: Record<string, SocketClient> = {};

  constructor(
    private messagesService: MessagesService,
    private roomQueryService: RoomQueryService,
    private userService: UserService,
    private jwtService: JwtService,
    private pushService: PushService
  ) {
    Logger.verbose(
      `SocketIO Server started on ${SOCKET_PORT()}`,
      'SocketServerGateway',
    );
  }

  @SubscribeMessage(ESocketEvents.Message)
  async handleMessage(
    client: SocketClient,
    payload: CreateMessageRequestDto,
  ): Promise<{ status: string }> {
    const userId = client.user.id;
    const { roomId } = payload;

    if (!this.connections[userId] || !client.rooms.has(roomId)) {
      const reason = this.connections[userId]
        ? 'client not in room'
        : 'client not connected';
      this.logger.error(
        `Unable to send message from ${userId} to ${roomId}. Reason: ${reason}`,
      );
      throw new WsException({
        message: `Unable to send message from ${userId} to ${roomId}. Reason: ${reason}`,
      });
    }

    const message = await this.messagesService.createMessage(
      userId,
      payload,
    );

    const tokens = await this.pushService.getTokens(message.room);
    tokens.forEach(token => {
      if (!this.getConnectionByUserId(token.userId)) {
        this.pushService.send({
          registrationToken: token.registrationToken,
          messageId: message.id,
          roomId: message.room,
          text: message.content
        });
      }
    });

    client.to(roomId).emit(ESocketEvents.Message, message);
    this.logger.log(
      `Message from ${userId}, connected: ${!!this.connections[userId]}`,
    );

    return { status: 'ok' };
  }

  @SubscribeMessage(ESocketEvents.MessageGeoRoom)
  async handleMessageGeoRoom(
    client: SocketClient,
    payload: CreateMessageRequestDto,
  ): Promise<{ status: string }> {
    const userId = client.user.id;

    if (!this.connections[userId]) {
      this.logger.error(
        `Unable to send message from ${userId}. Reason: client not connected`,
      );
      throw new WsException({
        message: `Unable to send message from ${userId}. Reason: client not connected`,
      });
    }

    const message = await this.messagesService.createMessage(
      userId,
      payload,
    );

    const users = payload.point
      ? await this.userService.getUsersByLocation(payload.point)
      : [];
    const sockets = users
      .map((userId) => this.connections[userId]?.id)
      .filter((u) => !!u);

    client.to(sockets).emit(ESocketEvents.MessageGeoRoom, message);
    this.logger.log(
      `Geo Message from ${userId}, connected: ${!!this.connections[userId]}`,
    );

    return { status: 'ok' };
  }

  afterInit(server: Server): void {
    this.logger.log('WS Init');
  }

  handleDisconnect(client: SocketClient): void {
    const userId = client.user.id;
    if (client.roomIds) {
      client
        .to([...client.roomIds])
        .emit(ESocketEvents.UserOffline, { userId });
    }
    this.logger.log(
      `Client disconnected: ${userId} rooms ${JSON.stringify([
        ...(client.roomIds || []),
      ])}`,
    );
  }

  async handleConnection(client: SocketClient, ...args: any[]): Promise<void> {
    const authHeader = client.handshake.headers.authorization;

    if (!authHeader) {
      client.disconnect(true);
      throw new WsException({ message: 'no authorization header' });
    }

    const arr = authHeader.split(' ');
    if (!arr || !arr.length) {
      client.disconnect(true);
      throw new WsException({ message: 'no authorization header' });
    }

    const token = arr[arr.length - 1];

    if (!token) {
      client.disconnect(true);
      throw new WsException({ message: 'Пользователь не авторизован' });
    }

    const user = this.jwtService.verify(token);
    if (user) {
      client.user = user;
      if (this.connections[user.id]) {
        this.logger.log(`Client already connected: ${user.id}`);
        this.connections[user.id].disconnect(true);
      }

      this.connections[user.id] = client;

      const connectionEvent: ISocketEventUserConnected = {
        userId: user.id,
      };

      const roomIds = await this.roomQueryService.getRoomIdsForUser(user.id);
      if (roomIds && roomIds.length) {
        client.join(roomIds);
        client.to(roomIds).emit(ESocketEvents.UserOnline, connectionEvent);
      }
      client.roomIds = new Set(roomIds || []);

      this.logger.log(
        `Client connected: ${user.id} rooms ${JSON.stringify([
          ...client.roomIds,
        ])}`,
      );
    } else {
      client.disconnect(true);
      throw new WsException({ message: 'Пользователь не авторизован' });
    }
  }

  getConnectionByUserId(userId: User['id']) {
    return this.connections[userId];
  }

  updateRoomName(userId: string, roomId: Room['id'], roomName: string) {
    const socket = this.connections[userId];
    if (socket) {
      socket
        .to(roomId)
        .emit(ESocketEvents.UpdateRoomName, { roomId, roomName });
    }
  }

  leaveRoom(userId: User['id'], roomId: Room['id']) {
    const socket = this.connections[userId];
    if (socket) {
      this.logger.log(`Client leave: ${userId} room ${roomId}`);
      socket.to(roomId).emit(ESocketEvents.UserExit, { userId, roomId });
      socket.leave(roomId);
      socket.roomIds.delete(roomId);
    }
  }

  joinRoom(userId: User['id'], roomId: Room['id']) {
    const socket = this.connections[userId];
    if (socket) {
      this.logger.log(`Client join: ${userId} room ${roomId}`);
      socket.join(roomId);
      socket.to(roomId).emit(ESocketEvents.UserJoin, { userId, roomId });
      socket.roomIds.add(roomId);
    }
  }

  deleteRoom(roomId: User['id']) {
    this.server.socketsLeave(roomId);
    // TODO remove from socket.roomIds
  }
}
