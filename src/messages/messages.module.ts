import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { DbModule } from '../db/db.module';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
  imports: [AuthModule, DbModule],
  exports: [MessagesService],
})
export class MessagesModule {}
