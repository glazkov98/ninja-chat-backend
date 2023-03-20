import { Global, HttpModule, Module } from '@nestjs/common';
import { PG_CONNECTOR_FACTORY, PgClient } from './factory/pg.factory';
import { AMQP_CONNECTION_SERVICE_FACTORY } from './factory/amqp-connection.factory';

import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    HttpModule,
    // RabbitMQModule
  ],
  providers: [
    // AMQP_CONNECTION_SERVICE_FACTORY,
    PG_CONNECTOR_FACTORY,
  ],
  exports: [
    PgClient,
    // AmqpConnection
  ],
})
export class ConnectorsModule {}
