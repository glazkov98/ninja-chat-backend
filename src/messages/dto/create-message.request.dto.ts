import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';
import { LatLngDto } from '../../common/dto/lat-lng.dto';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Trim } from '../../common/trim';

export class CreateMessageRequestDto {
  @ApiProperty({
    description: 'ID комнаты',
    type: String,
  })
  @Optional()
  readonly roomId?: string;

  @ApiProperty({
    description: 'Текст сообщения',
    type: String,
  })
  @IsString()
  @Trim()
  @IsNotEmpty()
  readonly message: string;

  @ApiProperty({
    description: 'Геолокация',
    type: LatLngDto,
  })
  @Type(() => LatLngDto)
  @Optional()
  readonly point?: LatLngDto;

  @ApiProperty({
    description: 'Делиться геопозицией',
    type: Boolean,
  })
  @Optional()
  @IsString()
  readonly share?: boolean;

  @ApiProperty({
    description: 'Псевдоним',
    type: String,
  })
  @IsString()
  readonly nickname: string;
}
