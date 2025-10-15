import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { commonRmqOptions, QUEUE, SERVICE } from './rabbitmq.config';
import { RabbitMQService } from './rabbitmq.service';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: SERVICE.AUTH,
        transport: Transport.RMQ,
        options: {
          ...commonRmqOptions,
          queue: QUEUE.AUTH,
        },
      },
      {
        name: SERVICE.MESSAGE,
        transport: Transport.RMQ,
        options: {
          ...commonRmqOptions,
          queue: QUEUE.MESSAGE,
        },
      },
      {
        name: SERVICE.NOTIFICATION,
        transport: Transport.RMQ,
        options: {
          ...commonRmqOptions,
          queue: QUEUE.NOTIFICATION
        }
      }
    ]),
  ],
  providers: [RabbitMQService],
  exports: [ClientsModule, RabbitMQService],
})
export class RabbitMQModule {}
