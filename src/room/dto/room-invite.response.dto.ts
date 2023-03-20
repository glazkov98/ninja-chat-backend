import { ApiProperty } from '@nestjs/swagger';
import { Room } from "../../db/interfaces/room.interface";

export class RoomInviteResponseDto {
  @ApiProperty({
    description: 'ID комнаты',
    type: String,
  })
  readonly roomId: Room['id'];

  @ApiProperty({
    description: 'Имя комнаты',
    type: String,
  })
  readonly roomName: Room['name'];

  @ApiProperty({
    description: 'Ссылка - приглашение',
    type: String,
  })
  readonly inviteLink: string;
}
