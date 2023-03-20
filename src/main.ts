import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from "@nestjs/common";
import { SwaggerStart } from './common/swagger/swagger';
import { SocketIoAdapter } from './socket-server/socket-server.adapter';
import { ConfigService } from '@nestjs/config';
import { LogLevel } from '@nestjs/common/services/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const configService = app.get(ConfigService);
  const isProduct = configService.get<string>('IS_PRODUCT');
  const serverPort = configService.get<string>('SERVER_PORT');

  const devLogger: LogLevel[] = ['error', 'warn', 'verbose', 'log', 'debug'];
  const prodLogger: LogLevel[] = ['error', 'warn', 'verbose'];

  app.useLogger(isProduct !== 'true' ? devLogger : prodLogger);
  app.useWebSocketAdapter(new SocketIoAdapter(app, '*'));
  app.useGlobalPipes(new ValidationPipe());

  // #swagger
  if (isProduct !== 'true') {
    SwaggerStart(app, serverPort);
  }

  await app.listen(serverPort, () => {
    Logger.verbose(`Server  started on ${serverPort}`, 'MODULE');
  });
}
bootstrap();
