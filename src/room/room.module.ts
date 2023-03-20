import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DbModule } from 'src/db/db.module';
import { SocketServerModule } from 'src/socket-server/socket-server.module';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
  controllers: [RoomController],
  providers: [RoomService],
  imports: [
    forwardRef(() => SocketServerModule),
    AuthModule,
    DbModule
  ],
  exports: [RoomService],
})
export class RoomModule {}
