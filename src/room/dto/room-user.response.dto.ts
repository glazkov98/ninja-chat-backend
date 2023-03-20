import { ApiProperty } from '@nestjs/swagger';
import { MessageCount } from 'src/db/interfaces/message-count.interface';
import { RoomUser } from '../../db/interfaces/room-user.interface';
export class RoomUserResponseDto implements RoomUser {
  @ApiProperty({
    type: String,
    description: 'ID комнаты',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'Имя комнаты',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'Тип комнаты',
  })
  type: string;

  @ApiProperty({
    type: String,
    description: 'ID владельца комнаты',
  })
  owner: string;

  @ApiProperty({
    type: String,
    description: 'Контент последнего сообщения',
  })
  lastMessageContent?: string;

  @ApiProperty({
    type: String,
    description: 'Дата последнего сообщения',
  })
  lastMessageDate?: string;

  @ApiProperty({
    description: 'Количество непрочитанных сообщений для комнаты',
  })
  countUnreadMessages: MessageCount;

  @ApiProperty({
    description: 'Список участников в комнате',
  })
  members?: string[];
}
