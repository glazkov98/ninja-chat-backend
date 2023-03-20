import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RoomMemberRequestDto {

    @ApiProperty({
        description: 'ID комнаты',
        type: String,
    })
    @IsString()
    readonly roomId: string;

    @ApiProperty({
        description: 'ID пользователя',
        type: String,
    })
    @IsString()
    readonly userId: string;

}