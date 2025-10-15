import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQService } from './rabbitmq.service';

@Module({
  imports: [
    ConfigModule, // Import ConfigModule to use ConfigService
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        imports: [ConfigModule], // Import ConfigModule to use ConfigService
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
        inject: [ConfigService], // Inject ConfigService into the factory function
      },
      {
        name: 'MESSAGE_SERVICE',
        imports: [ConfigModule], // Import ConfigModule to use ConfigService
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queueOptions: {
              durable: false,
              prefetch: 1,
            },
            queue: configService.get<string>('MESSAGE_QUEUE'),
          },
        }),
        inject: [ConfigService], // Inject ConfigService into the factory function
      },
    ]),
  ],
  controllers: [],
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
