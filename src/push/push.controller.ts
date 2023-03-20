import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestUser } from 'src/auth/request-user.interface';
import { PushRequestDto } from './dto/push.request.dto';
import { PushResponseDto } from './dto/push.response.dto';
import { PushService } from './push.service';

@ApiTags('push')
@ApiBearerAuth()
@Controller('push')
@UseGuards(JwtAuthGuard)
export class PushController {
    constructor(private pushService: PushService) {}

    @Post()
    create(@Req() req: RequestUser, @Body() pushDto: PushRequestDto): Promise<PushResponseDto> {
        const userId = req.user.id;
        return this.pushService.add(userId, pushDto.registrationToken);
    }

}
