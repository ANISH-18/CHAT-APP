import { UserMongoRepo } from '@MongoDB/repository';
import { NOTIFICATION_MESSAGE } from '@helpers/chat.constant';
import { Injectable,Logger } from '@nestjs/common';
import { NotificationQueueService } from '@rabbitmq/notifications.service';

@Injectable()
export class NotificationService {
  private readonly logger: Logger;
  constructor(
    private userRepository: UserMongoRepo,
    private readonly notifcationsService: NotificationQueueService,
  ) {
    this.logger = new Logger(NotificationService.name);
  }

  async sendNotification(
    authorId: string,
    recipientId: string,
    messageId: string,
    conversationId: string,
    content: any,
    content_copy: string,
    isActive: boolean
  ) {
    try {
      //Logger.log('INSIDE sendNotification 1');
      //FetchUser
      const [author, recipient] = await Promise.all([
        this.userRepository.findByUserId(authorId),
        this.userRepository.findByUserId(recipientId),
      ]);

      if (!author) {
        throw new Error('Author not found');
      }

      if (!recipient) {
        throw new Error('recipient not found');
      }
     // Logger.log('INSIDE sendNotification 2');
      //Construct Message
      const message: any = {
        message: NOTIFICATION_MESSAGE.NEW,
        messageId,
        conversationId,
        content,
        content_copy,
      };

      //Send Notification to Notification Service
      this.notifcationsService.sendNotification({
        author,
        recipient,
        message,
        isActive

      });
    } catch (error) {
      throw error;
    }
  }
}
