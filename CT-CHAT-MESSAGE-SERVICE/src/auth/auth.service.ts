import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { AuthHelper } from '@helpers';
import { JwtAuthService } from '@jwt_auth';

import { UserMongoRepo } from '@MongoDB/repository';
import { UserRegisteredEvent } from '@Events';
import { MessageGateway } from 'src/message/message.gateway';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserMongoRepo,
    private readonly authHelper: AuthHelper,
    private readonly jwtAuthService: JwtAuthService,
    private readonly messageGateway : MessageGateway,
  ) {}

  async handleRegisteredEvent(event: UserRegisteredEvent) {
    try {
      const {
        user_id,
        username,
        email,
        firstName,
        lastName,
        profilePic,
        org_id,
        role,
        businessName,
        userData,
      } = event.user ?? {};

      const newUser = {
        user_id,
        username,
        firstName,
        lastName,
        profilePic,
        email,
        org_id,
        role,
        businessName,
        userData,
      };
      // console.log('EVENT LISTENED', newUser);
      const saveUser = await this.userRepository.createUser(newUser);
      // console.log(saveUser);
    } catch (error) {
      throw error;
    }
  }

  async tokenCHeck(user_id: string, user: any) {
    // console.log(user_id, 'USER_ID');
    // console.log(user, 'USER');

    return {
      message: 'TOEKN CHECK',
      user_id,
      user,
    };
  }

  async updateUser(event: any) {
    try {
       Logger.log('Log updateUser _________________________________ ', event);

      await this.userRepository.updateUser(event.user_id, event.updateUser);

      if(event.updateUser.isOnline === 0 || event.updateUser.isOnline === 1)
      {
        const userStatus = {
          user_id: event.user_id,
          isOnline: event.updateUser.isOnline,
        };
        this.messageGateway.broadcastUserOnlineStatus(userStatus)
      }

      // Logger.log('updateUser', updateUser);
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(event: any) {
    try {
      await this.userRepository.deleteUser(event.user_id);
    } catch (error) {
      throw error;
    }
  }

  async updateUserProfilePic(event: any) {
    try {
      await this.userRepository.updateUserProfilePic(
        event.user_id,
        event.profilePic,
      );
    } catch (error) {
      throw error;
    }
  }


  async disableChat(event: any){
    try {
      // console.log('User id', event);
      Logger.log("Disable User Chat", event)
      await this.messageGateway.disableUser(event)
    } catch (error) {
      Logger.error("Error While disable User of parent-ids")
      throw error;
    }
  }
}
