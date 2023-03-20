import { Injectable } from '@nestjs/common';
import { CreateMessageRequestDto } from './dto/create-message.request.dto';
import { Message } from '../db/interfaces/message.interface';
import { MessageCount } from '../db/interfaces/message-count.interface';
import { MessagesQueryService } from '../db/services/messages.query.service';
import { User } from '../db/interfaces/user.interface';
import { LatLng } from 'src/db/interfaces/lat-lng.interface';

@Injectable()
export class MessagesService {
  constructor(
    private messagesQueryService: MessagesQueryService
  ) {}

  async createMessage(
    userId: User['id'],
    dto: CreateMessageRequestDto,
  ): Promise<Message> {
    return this.messagesQueryService.createMessage(userId, dto);
  }

  async createMessageForGeoRoom(
    userId: User['id'],
    dto: CreateMessageRequestDto,
  ): Promise<Message> {
    return this.messagesQueryService.createMessageForGeoRoom(userId, dto);
  }

  async getMessagesForRoom(roomId: string): Promise<Message[]> {
    return this.messagesQueryService.getMessagesForRoom(roomId);
  }

  async getMessagesForGeoRoom(coords: LatLng): Promise<Message[]> {
    return this.messagesQueryService.getMessagesForGeoRoom(coords);
  }

  async readMessage(messageId: string): Promise<boolean> {
    return this.messagesQueryService.readMessage(messageId);
  }

  async readAllMessages(roomId: string): Promise<boolean> {
    await this.messagesQueryService.readAllMessages(roomId);
    return true;
  }

  async getCountUnreadMessagesForRoomType(
    roomType: string,
  ): Promise<MessageCount> {
    return this.messagesQueryService.getCountUnreadMessagesForRoomType(
      roomType,
    );
  }
}
