import { Inject, Injectable, Logger } from '@nestjs/common';
import { SignupUserDto } from './dto/signup-user.dto';
import { UserEntity, UserRepository } from '@database';
import { ConflictException } from '@nestjs/common';
import { AuthHelper } from '@helpers';
import axios from 'axios';
import { syncuser } from '@helpers/constants';
import { ClientProxy } from '@nestjs/microservices';
import { UserRegisteredEvent } from '@events';

@Injectable()
export class PublicService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authHelper: AuthHelper,
    @Inject('AUTH_SERVICE') private readonly auth_queue: ClientProxy,
    @Inject('MESSAGE_SERVICE') private readonly message_queue: ClientProxy,
  ) {}

  //STAGE : STARTED
  async signUp(input: SignupUserDto) {
    try {
      // const userAlready = await this.userRepository.findByEmail(input.email);
      // if (userAlready) {
      //   throw new ConflictException('User already exists');
      // }
      // Logger.log(`Creating User => ${JSON.stringify(input.password)}`);
      // input.password = await this.authHelper.encodePassword(input.password);

      const user = await this.userRepository.createUser(input);

      //RABBITMQ MESSAGE QUEUE TO LISTEN EVENT at AUTH SERVICE
      try {
        // console.log('EVENT EMIT');
        //EVENT EMITTED TO SYNC AUTH SERVICE
        this.auth_queue.emit('user.registered', new UserRegisteredEvent(user));

        // this.auth_queue.emit('user.registered', user);
        // console.log('FRIST EVENT EMITTED');

        //EVENT EMITTED TO SYNC MESSAGE SERVICE
        this.message_queue.emit(
          'message.registered',
          new UserRegisteredEvent(user),
        );

        // console.log(sendUser);
        // console.log('FRIST EVENT EMITTED');

        console.log('EVENT EMITTED');
      } catch (error) {
        console.error('Error emitting event:', error);
      }

      //Update the Auth Service about New User
      //HTTP method
      // await this.syncUserWithAuthService(user);

      return {
        message: 'User Registered Successfully...',
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateUser() {}

  //AUTH SERVICE USER SYNC
  private async syncUserWithAuthService(user: UserEntity) {
    try {
      await axios.post(syncuser, {
        user_id: user.user_id,
        email: user.email,
        password: user.password,
        username: user.username,
      });
    } catch (error) {
      throw error;
    }
  }

  async tokenCHeck(user_id, user) {
    console.log(user_id, 'USER_ID');
    console.log(user, 'USER');

    return {
      message: 'TOEKN CHECK',
      user_id,
      user,
    };
  }
}
