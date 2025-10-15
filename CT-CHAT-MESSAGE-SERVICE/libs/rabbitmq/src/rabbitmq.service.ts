import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService {
  constructor(
    @Inject('USER_SERVICE') private readonly user_queue: ClientProxy,
  ) {}

  async handelOnlineStatus(data: any) {
    try {
      // Logger.log('INSIDE RMQ SERVICE');
      this.user_queue.emit('user.updateOnlineStatus', data);
    } catch (error) {
      throw error;
    }
  }
}
