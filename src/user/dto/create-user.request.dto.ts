import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequestDto {
  @ApiProperty({
    description: 'ID в социальной сети',
    example: '12345',
  })
  @IsString()
  readonly socialId: string;

  @ApiProperty({
    description: 'Тип социальной сети (google, facebook)',
    example: 'google',
  })
  @IsString()
  readonly type: string;
}
