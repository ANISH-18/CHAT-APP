import { Global, Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([{
      name: 'AUTH_SERVICE',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: Transport.RMQ,
        options: {
          urls: [configService.get<string>('RABBITMQ_URL')],
          queueOptions: {
            durable: false,
            prefetch: 1,
          },
          queue: configService.get<string>('AUTH_QUEUE'),
        }
      }),
      inject: [ConfigService]
    }])
  ],
  providers: [RabbitmqService],
  exports: [RabbitmqService],
})
export class RabbitmqModule {}
