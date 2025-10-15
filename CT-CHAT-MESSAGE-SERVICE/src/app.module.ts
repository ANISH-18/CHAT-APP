import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';

import { HelpersModule } from '@helpers';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

import { JwtAuthModule } from '@jwt_auth';

import { MongoDBModule } from '@MongoDB';
import { MessageGateway } from './message/message.gateway';
import { MessageService } from './message/message.service';
import { MessageController } from './message/message.controller';
import { ConversationService } from './conversation/conversation.service';
import { ConversationController } from './conversation/conversation.controller';
import { RabbitMQModule } from '@rabbitmq/rabbitmq.module';
import { RedisClientModule } from 'redis-client/redis-client';
import { NotificationService } from './message/notification.service';
import { socketService } from './message/socketUserOnline.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongoDBModule,
    HelpersModule,
    JwtAuthModule,
    RabbitMQModule,
    RedisClientModule,
  ],
  controllers: [
    AppController,
    AuthController,
    MessageController,
    ConversationController,
  ],
  providers: [
    AuthService,
    MessageService,
    MessageGateway,
    ConversationService,
    NotificationService,
    socketService
  ],
})
export class AppModule {}
