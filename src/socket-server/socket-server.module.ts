import { forwardRef, Global, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { SocketServerGateway } from './socket-server.gateway';
import { SocketServerService } from './socket-server.service';
import { MessagesModule } from 'src/messages/messages.module';
import { UserModule } from 'src/user/user.module';
import { DbModule } from 'src/db/db.module';
import { PushModule } from 'src/push/push.module';

@Global()
@Module({
  providers: [SocketServerGateway, SocketServerService],
  imports: [AuthModule, DbModule, MessagesModule, UserModule, PushModule],
  exports: [SocketServerService],
})
export class SocketServerModule {}
