import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

export class RabbitMQService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly auth_queue: ClientProxy,
    @Inject('MESSAGE_SERVICE') private readonly message_queue: ClientProxy,
    @Inject('NOTIFICATION_SERVICE') private readonly notification_queue: ClientProxy,
  ) {}

  //Verify API KEY WITH AUTH SERVICE
  async verifyAPIKey(apiKey: string) {
    try {
      //verify API KEY in AUTH SERVICE
      //Boolean Value
      const response = await this.auth_queue
        .send<boolean>({ cmd: 'verify.api.key' }, { apiKey })
        .toPromise();

      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(user_id: string, updateUser: object) {
    try {
      // Logger.log('user_id', user_id);
      // Logger.log('updateUser', JSON.stringify(updateUser));

      this.auth_queue.emit('auth.user-update', { user_id, updateUser });

      this.message_queue.emit('message.user-update', { user_id, updateUser });

      this.notification_queue.emit('notification.user-update', {user_id, updateUser})
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(user_id: string) {
    try {
      this.auth_queue.emit('auth.user-delete', { user_id });

      this.message_queue.emit('message.user-delete', { user_id });
    } catch (error) {
      throw error;
    }
  }

  async updateProfilePic(user_id: string, profilePic: string) {
    try {
      this.auth_queue.emit('auth.user-profilePic-update', {
        user_id,
        profilePic,
      });

      this.message_queue.emit('message.user-profilePic-update', {
        user_id,
        profilePic,
      });
    } catch (error) {
      throw error;
    }
  }
}
