import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RoomUser } from 'src/db/interfaces/room-user.interface';
import { Room } from 'src/db/interfaces/room.interface';
import { RoomQueryService } from 'src/db/services/room.query.service';
import { CreateRoomRequestDto } from './dto/create-room.request.dto';
import { RoomInviteResponseDto } from './dto/room-invite.response.dto';
import { RoomMemberRequestDto } from './dto/room-member.request.dto';
import { SocketServerService } from '../socket-server/socket-server.service';
import { User } from '../db/interfaces/user.interface';
import { UpdateRoomNameRequestDto } from './dto/update-room-name.request.dto';

@Injectable()
export class RoomService {
  logger = new Logger(RoomService.name);

  constructor(
    private roomQueryService: RoomQueryService,
    private socketService: SocketServerService,
  ) {}

  async createRoom(
    userId: string,
    dto: CreateRoomRequestDto,
  ): Promise<RoomInviteResponseDto> {
    const { roomId, name, type } = dto;

    if (type == 'geo')
      throw new HttpException(
        'Нельзя создать чат с типом geo',
        HttpStatus.NOT_FOUND,
      );

    const room = await this.roomQueryService.createRoom(
      roomId,
      name,
      type,
      userId,
    );

    if (!room)
      throw new HttpException(
        'Произошла ошибка при создании комнаты',
        HttpStatus.NOT_FOUND,
      );

    await this.addRoomMember({
      roomId: room.id,
      userId: room.owner,
    });

    return this._getInvite(room.id, room.name);
  }

  async getRoom(roomId: Room['id']): Promise<Room | null> {
    const room = this.roomQueryService.getRoom(roomId);
    if (!room) return null;
    return room;
  }

  _getInvite(roomId: Room['id'], roomName: string): RoomInviteResponseDto {
    const inviteLink = `/confirm/${roomId}`;

    return {
      roomId,
      roomName,
      inviteLink,
    };
  }

  async getInvite(roomId: Room['id']): Promise<RoomInviteResponseDto> {
    const room = await this.roomQueryService.getRoom(roomId);
    return this._getInvite(roomId, room.name);
  }

  async confirmInvite(dto: RoomMemberRequestDto): Promise<Room> {
    const { roomId, userId } = dto;
    const room = await this.getRoom(roomId);
    const countMembers = await this.getCountMembersForRoom(roomId);

    if ((room.type == 'single' && countMembers === 2) || userId == room.owner) {
      this.logger.error(`
        Unable to accept invite to room with id ${roomId}, members ${countMembers} for user ${userId}
      `);
      throw new HttpException(
        'Невозможно принять инвайт',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    if (room.isDeleted) {
      throw new HttpException('Чат удален', HttpStatus.FORBIDDEN);
    }

    await this.addRoomMember({ roomId, userId });

    if (room.members != null) {
      room.members.push(userId);
    }

    return room;
  }

  async getCountMembersForRoom(roomId: Room['id']): Promise<number> {
    return this.roomQueryService.getCountMembersForRoom(roomId);
  }

  async addRoomMember(dto: RoomMemberRequestDto): Promise<boolean> {
    this.socketService.joinRoom(dto.userId, dto.roomId);
    return this.roomQueryService.addRoomMember(dto);
  }

  async deleteRoomMember(userId: string, dto: RoomMemberRequestDto): Promise<boolean> {
    const room = await this.getRoom(dto.roomId);

    if (!room || (userId != room.owner && userId != dto.userId)) {
      throw new HttpException(
        'Ошибка при удалении участника',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    this.socketService.leaveRoom(dto.userId, dto.roomId);
    return this.roomQueryService.deleteRoomMember(dto);
  }

  async deleteRoom(userId: string, roomId: Room['id']): Promise<boolean> {
    this.socketService.deleteRoom(roomId);
    return this.roomQueryService.deleteRoom(userId, roomId);
  }

  async getRoomIdsForUser(userId: User['id']): Promise<string[]> {
    return this.roomQueryService.getRoomIdsForUser(userId);
  }

  async getRoomsForUser(userId: User['id']): Promise<RoomUser[]> {
    return this.roomQueryService.getRoomsForUser(userId);
  }

  async getGeoRoomId(): Promise<string> {
    const geoRoom = await this.roomQueryService.getGeoRoom();
    return geoRoom['id'];
  }

  async getGeoRoom(): Promise<Room> {
    return this.roomQueryService.getGeoRoom();
  }

  async updateRoomName(userId: string, dto: UpdateRoomNameRequestDto): Promise<Room> {
    const {roomId, name} = dto;
    this.socketService.updateRoomName(userId, roomId, name);
    return this.roomQueryService.updateRoomName(userId, roomId, name);
  }
}
