import { ApiProperty } from '@nestjs/swagger';
import { Push } from 'src/db/interfaces/push.interface';

export class PushRequestDto implements Push {
  @ApiProperty({
    type: String,
    description: 'Firebase токен',
  })
  registrationToken: string;
}
