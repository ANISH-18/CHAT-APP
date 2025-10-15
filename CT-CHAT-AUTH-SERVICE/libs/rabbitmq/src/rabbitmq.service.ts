import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService {
  constructor(
    @Inject('USER_SERVICE') private readonly user_queue: ClientProxy,
    @Inject('MESSAGE_SERVICE') private readonly auth_queue: ClientProxy,
  ) {}

  async handelOnlineStatus(data: any) {
    try {
      Logger.log('INSIDE RMQ SERVICE');
      this.user_queue.emit('user.updateOnlineStatus', data);
    } catch (error) {
      throw error;
    }
  }


  async disableUser(data: string){
    try {
      this.auth_queue.emit('disable.parent.chat', data)
     
    } catch (error) {
      Logger.error("Failed to emit user_id for chat disable")
      throw error;
    }
  }
}
