import { Module } from '@nestjs/common';
import { MessagesQueryService } from './services/messages.query.service';
import { PushQueryService } from './services/push.query.service';
import { RoomQueryService } from './services/room.query.service';
import { UserQueryService } from './services/user.query.service';

const services = [MessagesQueryService, UserQueryService, RoomQueryService, PushQueryService];

@Module({
  controllers: [],
  providers: [...services],
  exports: [...services],
})
export class DbModule {}
