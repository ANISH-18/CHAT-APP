import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from '@mail';
import { HelpersModule } from '@helpers';
import { MongoDbModule } from '@MongoDB/mongo-db';
import { PushNotificationsController } from './push-notifications/push-notifications.controller';
import { PushNotificationsService } from './push-notifications/push-notifications.service';
import { FcmModule } from '@/fcm';
import { RabbitmqModule } from '@/rabbitmq';
import { AuthLibModule } from 'n/auth-lib';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongoDbModule,
    MailModule,
    HelpersModule,
    FcmModule,
    RabbitmqModule,
    AuthLibModule,
  ],
  controllers: [AppController, PushNotificationsController],
  providers: [PushNotificationsService],
})
export class AppModule {}
