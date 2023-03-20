import { Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AmqpConnection, RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';

export const AMQP_CONNECTION_SERVICE_FACTORY = {
  provide: AmqpConnection,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<AmqpConnection> => {
    const amqpConfig = configService.get('amqp') as RabbitMQConfig;

    const amqpConnection = new AmqpConnection(amqpConfig);

    Logger.verbose('AMQP Init...', 'Amqp_Connection');
    await amqpConnection.init().catch((error) => {
      Logger.error('connection fail', error, 'RABBIT MQ Connection factory');
    });

    Logger.verbose(`AMQP Init done (${amqpConfig.uri}).`, 'Amqp_Connection');
    return amqpConnection;
  },
};
