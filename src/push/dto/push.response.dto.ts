import { ApiProperty } from '@nestjs/swagger';
import { Push } from 'src/db/interfaces/push.interface';

export class PushResponseDto implements Push {
  @ApiProperty({
    type: String,
    description: 'ID записи',
  })
  id?: string;

  @ApiProperty({
    type: String,
    description: 'ID юзера',
  })
  userId?: string;

  @ApiProperty({
    type: String,
    description: 'Токен',
  })
  registrationToken: string;

  @ApiProperty({
    type: String,
    description: 'Дата сообщения',
  })
  createdAt?: string;
}
