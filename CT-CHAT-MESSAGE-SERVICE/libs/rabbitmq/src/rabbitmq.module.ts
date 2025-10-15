import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQService } from './rabbitmq.service';
import { NotificationQueueService } from './notifications.service';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queueOptions: {
              durable: false,
              prefetch: 1,
            },
            queue: configService.get<string>('USER_QUEUE'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'NOTIFCATION_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queueOptions: {
              durable: false,
              prefetch: 1,
            },
            queue: configService.get<string>('NOTIFICATION_QUEUE'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [],
  providers: [RabbitMQService, NotificationQueueService],
  exports: [RabbitMQService, NotificationQueueService],
})
export class RabbitMQModule {}
