import { ApiProperty } from '@nestjs/swagger';
import { MessageCount } from '../../db/interfaces/message-count.interface';

export class MessageCountResponseDto implements MessageCount {
  @ApiProperty({
    type: Number,
    description: 'Количество сообщений',
  })
  count: number;
}
