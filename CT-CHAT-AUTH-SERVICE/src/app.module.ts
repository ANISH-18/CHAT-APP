import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
// import { MailModule } from '@mail';
import { HelpersModule } from '@helpers';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { DatabaseModule } from '@database';
import { JwtAuthModule } from '@jwt_auth';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OauthController } from './oauth/oauth.controller';
import { ApiKeyService, OauthService } from './oauth/oauth.service';
import { ClientService } from './client/client.service';
import { ClientController } from './client/client.controller';
import { RabbitMQModule } from '@Rabbitmq/rabbitmq/rabbitmq.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // ClientsModule.register([
    //   {
    //     name: 'EVENT_BUS',
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: ['amqp://localhost:5671'],
    //       queue: 'event_queue',

    //       queueOptions: {
    //         durable: true,
    //       },
    //     },
    //   },
    // ]),
    RabbitMQModule,
    DatabaseModule,
    // MailModule,
    HelpersModule,
    JwtAuthModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [
    AppController,
    AuthController,
    OauthController,
    ClientController,
    UserController,
  ],
  providers: [
    AuthService,
    OauthService,
    ClientService,
    ApiKeyService,
    UserService,
  ],
})
export class AppModule {}
