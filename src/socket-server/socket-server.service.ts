import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SocketServerGateway } from './socket-server.gateway';
import { User } from '../db/interfaces/user.interface';
import { Room } from '../db/interfaces/room.interface';

@Injectable()
export class SocketServerService {
  constructor(private gateway: SocketServerGateway) {}

  joinRoom(userId: User['id'], roomId: Room['id']) {
    this.gateway.joinRoom(userId, roomId);
  }

  updateRoomName(userId: string, roomId: string, name: string) {
    this.gateway.updateRoomName(userId, roomId, name);
  }

  leaveRoom(userId: User['id'], roomId: Room['id']) {
    this.gateway.leaveRoom(userId, roomId);
  }

  deleteRoom(roomId: Room['id']) {
    this.gateway.deleteRoom(roomId);
  }
}
