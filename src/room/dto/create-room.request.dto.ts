import { IsString, IsUUID } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateRoomRequestDto {

  @ApiProperty({
    description: 'Название комнаты',
    example: 'Комната отдыха',
    type: String,
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'Тип комнаты (single, multiple, geo)',
    example: 'single',
    type: String,
  })
  @IsString()
  readonly type: string;

  @ApiPropertyOptional({
    description: 'UUID комнаты',
    example: 'ff937b89-7403-4fd2-ba8d-3ad48b39bb8d',
    type: String,
  })
  @IsUUID()
  readonly roomId: string;

}
