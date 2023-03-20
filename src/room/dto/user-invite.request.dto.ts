import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserInviteRequestDto {

    @ApiProperty({
        description: 'ID пользователя',
        type: String,
    })
    @IsString()
    readonly userId: string;

}