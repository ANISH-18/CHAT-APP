import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePushNotificationDto } from './dto/create-push-notification.dto';
import { UpdatePushNotificationDto } from './dto/update-push-notification.dto';
import { FcmService } from '@/fcm';
import { NotificationRepository } from '@MongoDB/mongo-db/repository';
import { GetNotification } from './dto/get-notifications.dto';
import { NOTIFICATION, NOTIFICATION_TYPE } from '@helpers';
import { RabbitmqService } from '@/rabbitmq';

@Injectable()
export class PushNotificationsService {
  constructor(
    private readonly fcmService: FcmService,
    private readonly notificationRepository: NotificationRepository,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  async sendNotifications(data: any) {
    try {
      const { author, recipient, message, isActive } = data;

      const { fcmToken } = recipient;

      // if (!fcmToken) return;

      //Get Notification
      const notification = await this.getNotifications(
        author,
        recipient,
        message.conversationId,
      );
      //check message that isActive flag based on it get the uri
      Logger.log('fcmToken', fcmToken);
     

      Logger.log('GET CHAT URL & FCM Tokens', isActive);
      const authResponse = await this.rabbitmqService.getUriAndFcmTokens({
        user_id: recipient._id,
        conversationId: message.conversationId,
        authorRole: author.role,
        isActive
      });
      if(authResponse.chatEnable === false)
      {
        Logger.log("Chat Disable!! Notification will be not be processed", recipient._id)
        return;
      }
    

      //Extract the tokens
      const fcmTokens = Array.isArray(authResponse?.FcmTokens?.data)
        ? authResponse.FcmTokens.data.map((tokenObj: any) => tokenObj.fcmToken)
        : [];


      Logger.log('Extracted FCM Tokens:', fcmTokens);

      //Inc The count
      notification.count += NOTIFICATION.UPDATE;

      const payload = {
        // notification: {
        //   title: 'New Message',
        //   body: `${notification.count} ${message.message} ${author.firstName}`,
        // },
        data: {
          notificationType: NOTIFICATION_TYPE['CT-CHAT'],
          payload: JSON.stringify({
            uri: authResponse.redirect_url,
            author,
            recipient,
            message,
            title: 'New Message',
            body:`${notification.count} ${message.message} ${author.firstName}`
          }),
        },
        android: {
          collapseKey: 'example-collapse-key',
        },
      };
      Logger.log('payload Notification', payload);

      if (fcmTokens.length) {
        Logger.log('Sending FCM TOKEN');
        for(const token of fcmTokens)
        {
          try {
            Logger.log("Token", token)
            this.fcmService.sendFCMNotification(token, payload);
          } catch (error) {
            Logger.log("Error While Iterating the tokens")
            throw error;
          }
        }
        
      }

      //Update the count

      await this.notificationRepository.updateCount(notification._id);

      // const token = 'adad';

      //Store the Notification in DB
      // Logger.log('Payload of author and recipient', author, recipient);
    } catch (error) {
      throw error;
    }
  }

  async getNotification(getNotification: GetNotification) {
    try {
      const { email, role } = getNotification;

      const findNotifications =
        await this.notificationRepository.findPendingNotify(email, role);

      if (!findNotifications || findNotifications.length === 0) {
        throw new NotFoundException('No Pending Notifications');
      }

      const notificationCount = findNotifications.length;

      Logger.log('Sending');
      return {
        message: 'Notifications fetched successfully',
        data: {
          count: notificationCount,
          data: findNotifications,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  private async getNotifications(
    author: any,
    recipient: any,
    conversationId: string,
  ) {
    try {
      // const {_id } =
      Logger.log('INSIDE NOTIFICATION');
      Logger.log('ConversationID', conversationId);
      const existingNotification =
        await this.notificationRepository.findNotification(
          author._id,
          recipient._id,
          conversationId,
        );

      if (!existingNotification) {
        return await this.notificationRepository.createNotification(
          author,
          recipient,
          conversationId,
        );
      }

      return existingNotification;
    } catch (error) {
      throw error;
    }
  }

  async updateNotification(data: any) {
    try {
      const { conversation_id, user_id } = data;
      Logger.log('update');

      await this.notificationRepository.updateSeenCount(
        conversation_id,
        user_id,
      );
    } catch (error) {
      throw error;
    }
  }



  async updateUserData(data: any)
  {
    try {
      Logger.log("user Updating ............")
      const {user_id, updateUser} = data;

      const {firstName, lastName, email} = updateUser;

      const authorUpdateQuery = {
        $set: {
          authorFirstName: firstName,
          authorLastName: lastName,
          authorEmail: email,
        },
      };

      const recipientUpdateQuery = {
        $set: {
          recipentFirstName: firstName,
          recipentLastName: lastName,
          recipentEmail: email,
        },
      };
  

      await this.notificationRepository.updateAuthor(user_id, authorUpdateQuery);


      await this.notificationRepository.updateRecipent(user_id, recipientUpdateQuery);
  
    } catch (error) {
      Logger.error("Failed to Update usser in Notification Data")
      throw error;
    }
  }
}
