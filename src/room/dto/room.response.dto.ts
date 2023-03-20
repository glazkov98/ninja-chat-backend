import { ApiProperty } from '@nestjs/swagger';
import { Room } from 'src/db/interfaces/room.interface';


export class RoomResponseDto implements Room {

    @ApiProperty({
        type: String,
        description: 'ID комнаты'
    })
    id: string;

    @ApiProperty({
        type: String,
        description: 'Имя комнаты'
    })
    name: string;

    @ApiProperty({
        type: String,
        description: 'Тип комнаты'
    })
    type?: string;

    @ApiProperty({
        type: String,
        description: 'ID владельца комнаты'
    })
    owner?: string;

    @ApiProperty({
        type: String,
        description: 'Участники комнаты'
    })
    members?: string[] | null;

    @ApiProperty({
        type: Boolean,
        description: 'Удален ли чат'
    })
    isDeleted?: boolean;
}