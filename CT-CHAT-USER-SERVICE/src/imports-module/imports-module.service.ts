import { UserRepository, UserRoleRepository } from '@database';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { PublicService } from 'src/public/public.service';
import { SyncCreateUserDto } from './dto/syncCreateUser.dto';
import { DeleteUserDto } from './dto/delete-User.dto';
import { UserRegisteredEvent } from '@events';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ImportsModuleService {
  constructor(
    private readonly publicService: PublicService,
    private readonly userRepository: UserRepository,
    @Inject('AUTH_SERVICE') private readonly auth_queue: ClientProxy,
    @Inject('MESSAGE_SERVICE') private readonly message_queue: ClientProxy,
  ) {}

  //SAVE USERS
  async saveUsers(singleData) {
    await Promise.all(
      singleData.map(async (data) => {
        // Logger.log(`Data => ${JSON.stringify(data)}`);
        // Logger.log(`Data.userData => ${JSON.stringify(data.userData)}`);

        //Type of data to be passed with SignUp-UserDto
        await this.publicService.signUp(data as any);
        // return await this.userRoleRepository.createUserRole(
        //   user.data.user_id,
        //   data.role,
        //   data.org_id,
        // );
      }),
    );
  }

  async syncCreateUser(syncCreateUserDto: SyncCreateUserDto) {
    try {
      Logger.log('syncCreateUserDto', JSON.stringify(syncCreateUserDto));

      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        profilePic,
        address,
        org_id,
        businessName,
        role,
        parent_id,
        ref_userId,
        userData1,
      } = syncCreateUserDto;

      // let userData: any;
      // if (userData1) {
      //   userData = JSON.parse(userData1);
      // }

      let userData: any;
      if (userData1) {
        userData = JSON.parse(userData1);
      }

      //Make TCP call to verify the Organization API Key

      //Save User

      const user = await this.userRepository.createUser({
        firstName,
        lastName,
        email,
        phoneNumber,
        profilePic,
        address,
        org_id: 1,
        businessName,
        role,
        parent_id,
        ref_userId,
        userData,
      });
      Logger.log('USER', user);

      try {
        this.auth_queue.emit('user.registered', new UserRegisteredEvent(user));
        this.message_queue.emit(
          'message.registered',
          new UserRegisteredEvent(user),
        );
      } catch (error) {
        throw error;
      }

      Logger.log('User Created', JSON.stringify(user));

      return {
        message: "User Created Successfully'",
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(deleteUserDto: DeleteUserDto) {
    try {
      const { parent_id, role, ref_userId } = deleteUserDto;
      const deleteUser = await this.userRepository.deleteUser(
        parent_id,
        role,
        ref_userId,
      );

      return {
        message: 'User Deleted Successfully',
        data: deleteUser,
      };
    } catch (error) {
      throw error;
    }
  }
}
