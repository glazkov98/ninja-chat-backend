import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateRoomRequestDto } from './dto/create-room.request.dto';
import { RoomInviteResponseDto } from './dto/room-invite.response.dto';
import { RoomUserResponseDto } from './dto/room-user.response.dto';
import { RoomResponseDto } from './dto/room.response.dto';
import { UpdateRoomNameRequestDto } from './dto/update-room-name.request.dto';
import { RoomService } from './room.service';

@ApiTags('rooms')
@ApiBearerAuth()
@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomController {
  constructor(private roomService: RoomService) {}

  @ApiOperation({ summary: 'Получение списка комнат для пользователя' })
  @Get('/')
  getRoomsForUser(@Req() req): Promise<RoomUserResponseDto[]> {
    const userId = req.user.id;
    return this.roomService.getRoomsForUser(userId);
  }

  @ApiOperation({ summary: 'Получение количества участников в комнате' })
  @Get('/:room/count')
  getCountMembersForRoom(@Param('roomId') roomId: string): Promise<number> {
    return this.roomService.getCountMembersForRoom(roomId);
  }

  @ApiOperation({ summary: 'Создание комнаты' })
  @ApiOkResponse({
    type: RoomInviteResponseDto,
  })
  @Post()
  create(
    @Req() req,
    @Body() roomDto: CreateRoomRequestDto,
  ): Promise<RoomInviteResponseDto> {
    const userId = req.user.id;
    return this.roomService.createRoom(userId, roomDto);
  }

  @ApiOperation({ summary: 'Получение инвайта' })
  @ApiOkResponse({
    type: RoomInviteResponseDto,
  })
  @Get('/:room/invite')
  getInvite(@Param('room') roomId: string): Promise<RoomInviteResponseDto> {
    return this.roomService.getInvite(roomId);
  }

  @ApiOperation({ summary: 'Подтверждение инвайта' })
  @Post('/:room/confirm')
  confirmInvite(@Req() req, @Param('room') roomId: string): Promise<RoomResponseDto> {
    const userId = req.user.id;
    return this.roomService.confirmInvite({ roomId, userId });
  }

  @ApiOperation({ summary: 'Изменение названия комнаты' })
  @Put('/update/name')
  updateRoomName(@Req() req, @Body() updateDto: UpdateRoomNameRequestDto): Promise<RoomResponseDto> {
    const userId = req.user.id;
    return this.roomService.updateRoomName(userId, updateDto);
  }

  @ApiOperation({ summary: 'Удаление участника из комнаты' })
  @Delete('/:roomId/members/:userId')
  deleteMember(
    @Req() req,
    @Param('roomId') roomId: string,
    @Param('userId') userId: string,
  ): Promise<boolean> {
    const reqUserId = req.user.id;
    return this.roomService.deleteRoomMember(reqUserId, { roomId, userId });
  }

  @ApiOperation({ summary: 'Удаление комнаты' })
  @Delete('/:room')
  delete(@Req() req, @Param('room') roomId: string): Promise<boolean> {
    const userId = req.user.id;
    return this.roomService.deleteRoom(userId, roomId);
  }

  @ApiOperation({ summary: 'Получение geo комнаты' })
  @Get('/geo')
  getGeoRoom(): Promise<RoomResponseDto> {
    return this.roomService.getGeoRoom();
  }

  @ApiOperation({ summary: 'Получение комнаты' })
  @Get('/:room')
  get(@Param('room') roomId: string): Promise<RoomResponseDto | null> {
    return this.roomService.getRoom(roomId);
  }
}
