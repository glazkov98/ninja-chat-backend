import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { User } from '../../db/interfaces/user.interface';

export class UserResponseDto implements User {

    @ApiProperty({
        description: 'ID пользователя',
    })
    @IsString()
    id: string;

    @ApiProperty({
        description: 'ID в google',
        example: '12345',
    })
    googleId?: string | null;

    @ApiProperty({
        description: 'ID в facebook',
        example: '12345',
    })
    facebookId?: string | null;

    @ApiProperty({
        type: String,
        description: 'Геолокация',
    })
    lastCoords?: string | null;

    @ApiProperty({
        type: String,
        description: 'Дата регистрации',
    })
    createdAt?: string;

}