import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AMQP_CONFIG, JWT_CONFIG } from './common/configs';
import { ConnectorsModule } from './common/connectors/connectors.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SocketServerModule } from './socket-server/socket-server.module';
import { RoomModule } from './room/room.module';
import { MessagesModule } from './messages/messages.module';
import { DbModule } from './db/db.module';
import { AppLoggerMiddleware } from "./app-logger-middleware";
import { PushModule } from './push/push.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AMQP_CONFIG, JWT_CONFIG],
    }),
    ConnectorsModule,
    DbModule,
    AuthModule,
    UserModule,
    SocketServerModule,
    RoomModule,
    MessagesModule,
    PushModule,
  ],
  providers: [ConfigService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
