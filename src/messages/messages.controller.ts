import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestUser } from 'src/auth/request-user.interface';
import { Message } from 'src/db/interfaces/message.interface';
import { CreateMessageRequestDto } from './dto/create-message.request.dto';
import { MessageCountResponseDto } from './dto/message-count.response.dto';
import { MessageResponseDto } from './dto/message.response.dto';
import { MessagesService } from './messages.service';

@ApiTags('messages')
@ApiBearerAuth()
@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private messageService: MessagesService) {}

  @ApiOperation({ summary: 'Добавление сообщения' })
  @Post()
  create(
    @Req() req: RequestUser,
    @Body() messageDto: CreateMessageRequestDto,
  ): Promise<MessageResponseDto> {
    const userId = req.user.id;
    return this.messageService.createMessage(userId, messageDto);
  }

  @ApiOperation({ summary: 'Добавление сообщения в geo-чат' })
  @Post('/geo')
  createForGeoRoom(
    @Req() req: RequestUser,
    @Body() messageDto: CreateMessageRequestDto,
  ): Promise<MessageResponseDto> {
    const userId = req.user.id;
    return this.messageService.createMessageForGeoRoom(userId, messageDto);
  }

  @ApiOperation({ summary: 'Получение сообщений для комнаты' })
  @Get('/room/:roomId')
  getForRoom(@Param('roomId') roomId: string): Promise<MessageResponseDto[]> {
    return this.messageService.getMessagesForRoom(roomId);
  }

  @ApiOperation({ summary: 'Получение сообщений для geo комнаты' })
  @Get('/geo')
  getForGeoRoom(
    @Req() req,
    @Query('long') lng: string,
    @Query('lat') lat: string,
  ): Promise<Message[]> {
    return this.messageService.getMessagesForGeoRoom({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    });
  }

  @ApiOperation({ summary: 'Сделать одно сообщение прочитанным' })
  @Post('/:messageId/read')
  readMessage(@Param('messageId') messageId: string): Promise<boolean> {
    return this.messageService.readMessage(messageId);
  }

  @ApiOperation({
    summary: 'Сделать все непрочитанные сообщения в комнате прочитанными',
  })
  @Post('/room/:roomId/read')
  readMessages(@Param('roomId') roomId: string): Promise<boolean> {
    return this.messageService.readAllMessages(roomId);
  }

  @ApiOperation({
    summary: 'Получить количество непрочитанных сообщений для типа комнаты',
  })
  @Get('/room-type/:roomType/count')
  getCountUnreadMessagesForRoomType(
    @Param('roomType') roomType: string,
  ): Promise<MessageCountResponseDto> {
    return this.messageService.getCountUnreadMessagesForRoomType(roomType);
  }
}
