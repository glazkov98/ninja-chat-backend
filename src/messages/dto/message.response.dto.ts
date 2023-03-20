import { ApiProperty } from '@nestjs/swagger';
import { Message } from '../../db/interfaces/message.interface';

export class MessageResponseDto implements Message {
  @ApiProperty({
    type: String,
    description: 'ID сообщения',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'ID комнаты',
  })
  room: string;

  @ApiProperty({
    type: String,
    description: 'Контент сообщения',
  })
  content: string;

  @ApiProperty({
    type: String,
    description: 'Геолокация',
  })
  location?: string | null;

  @ApiProperty({
    type: Boolean,
    description: 'Делиться геопозицией',
  })
  share?: boolean;

  @ApiProperty({
    type: String,
    description: 'ID отправителя',
  })
  userId: string;

  @ApiProperty({
    type: String,
    description: 'Никнейм отправителя',
  })
  nickname: string;

  @ApiProperty({
    type: Boolean,
    description: 'Статус сообщения',
  })
  read: boolean;

  @ApiProperty({
    type: String,
    description: 'Дата сообщения',
  })
  createdAt: string;
}
