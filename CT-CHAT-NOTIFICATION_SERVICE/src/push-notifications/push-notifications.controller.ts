import { Controller, Get, Logger, Query, UseGuards } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { PushNotificationsService } from './push-notifications.service';
import { GetNotification } from './dto/get-notifications.dto';
import { ApiKeyGuard } from 'n/auth-lib/guards';

@Controller('notifications')
export class PushNotificationsController {
  constructor(
    private readonly pushNotificationsService: PushNotificationsService,
  ) {}

  @EventPattern('send.notifcations')
  async processNotifications(event: any) {
    try {
      Logger.log(event, 'event=> SEND>NOTIFICATIONS');
      this.pushNotificationsService.sendNotifications(event);
    } catch (error) {
      throw error;
    }
  }

  @EventPattern('update.count')
  async UpdateCount(event: any) {
    try {
      Logger.log('listen event', event);
      this.pushNotificationsService.updateNotification(event);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(ApiKeyGuard)
  @Get('get')
  getNotification(@Query() getNotification: GetNotification) {
    try {
      Logger.log('Fetching  Notification');
      return this.pushNotificationsService.getNotification(getNotification);
    } catch (error) {
      throw error;
    }
  }

  @EventPattern('notification.user-update')
  updateUserData(event: any){
    Logger.log("update notificatio user data")
    this.pushNotificationsService.updateUserData(event);
  }
}
