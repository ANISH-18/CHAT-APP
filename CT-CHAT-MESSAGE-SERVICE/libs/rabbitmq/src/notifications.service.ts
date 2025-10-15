import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NotificationQueueService {
  constructor(
    @Inject('NOTIFCATION_SERVICE')
    private readonly notifcation_queue: ClientProxy,
  ) {}

  /**
   *  Device Token FCM
   *  sender_info
   *  receiver_info
   */
  async sendNotification(data: any) {
    try {
     // Logger.log(' SEND NOTIFCATION DATA', data);
      this.notifcation_queue.emit('send.notifcations', data);
    } catch (error) {
      throw error;
    }
  }

  async updateCount(data: any) {
    try {
     // Logger.log('Emit COunt', data);
      this.notifcation_queue.emit('update.count', data);
    } catch (error) {
      throw error;
    }
  }
}
