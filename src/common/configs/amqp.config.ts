import { registerAs } from '@nestjs/config';
import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';

export const AMQP_CONFIG_EXCHANGES = [
  // {
  //     name: 'notification',
  //     type: 'topic',
  // },
];

export const AMQP_CONFIG = registerAs(
  'amqp',
  (): RabbitMQConfig => ({
    uri: process.env.AMQP_URI.split(',').filter((amqpUrl) => !!amqpUrl),
    exchanges: AMQP_CONFIG_EXCHANGES,
    connectionInitOptions: { wait: true, timeout: 20000 },
    connectionManagerOptions: {
      heartbeatIntervalInSeconds: 15,
      reconnectTimeInSeconds: 30,
    },
  }),
);
