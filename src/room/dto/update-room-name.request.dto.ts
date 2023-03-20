import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class UpdateRoomNameRequestDto {

    @ApiProperty({
        description: 'ID комнаты',
        type: String,
    })
    @IsString()
    readonly roomId: string;

    @ApiProperty({
        description: 'Новое название комнаты',
        example: 'Комната отдыха',
        type: String,
    })
    @IsString()
    @Length(3, 100)
    readonly name: string;

}