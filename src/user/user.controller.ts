import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestUser } from 'src/auth/request-user.interface';
import { LatLngDto } from 'src/common/dto/lat-lng.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { UserService } from './user.service';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private userService: UserService) {}

    @ApiOperation({ summary: 'Отправка текущик координат' })
    @Post('/coords')
    setUserLastCoords(@Req() req: RequestUser, @Body() coordsDto: LatLngDto): Promise<UserResponseDto> {
        const userId = req.user.id;
        return this.userService.setUserLastCoords(userId, coordsDto);
    }
}
