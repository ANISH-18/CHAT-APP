import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { UserRepository } from '@database';
import { UpdateUserDto } from './dto/updateUser.dto';
import { RabbitMQService } from 'libs/rabbitmq/src';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UpdateProfilePicDto } from './dto/profile-image.dto';
import { UserProfileDto } from './dto/user-profile.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async updateUser(updateUserDto: UpdateUserDto) {
    try {
      Logger.log('updateUserDto', JSON.stringify(updateUserDto));

      const {
        ref_userId,
        // parent_id,
        role,
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        fcmToken,
        userData1,
        emailToUpdate,
        isOnline,
      } = updateUserDto;

      Logger.log('Before');
      let userData: any;
      if (userData1 && (userData1.length > 0 || userData1.length == 0)) {
        userData = JSON.parse(userData1);
      }

      Logger.log('after');

      Logger.log('userData1', userData);


      //CHECK USER EXISTS
      const isUser = await this.userRepository.findUserWithRef({
        ref_userId,
        // parent_id,
        email,
        role,
      });
      Logger.log('Update User', JSON.stringify(isUser));

      if (!isUser) {
        throw new NotFoundException('User Not Found');
      }

      //IF USER UPDATE
      const updateUser = await this.userRepository.updateUser(isUser.user_id, {
        firstName,
        lastName,
        phoneNumber,
        address,
        fcmToken,
        userData,
        email: emailToUpdate,
        isOnline
      });

      this.rabbitMQService.updateUser(isUser.user_id, {
        firstName,
        lastName,
        email: emailToUpdate,
        phoneNumber,
        address,
        userData,
        fcmToken,
        isOnline
      });

      Logger.log('Update Success');

      //Update in other service

      // this.rabbitMQService.updateUser(updateUser);

      const affectedRows = updateUser.affected || 0;

      if (affectedRows > 0) return { message: 'User Updated Successfully' };
      else return { message: 'User Not Found' };
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(deleteUserDto: DeleteUserDto) {
    try {
      const { ref_userId, email, role } = deleteUserDto;

      //Check if User Exists
      const isUser = await this.userRepository.findUserWithRef({
        ref_userId,
        email,
        role,
      });

      if (!isUser) {
        throw new NotFoundException('User Not Found');
      }

      const deleteUser = await this.userRepository.deleteUserWithID(
        isUser.user_id,
      );

      this.rabbitMQService.deleteUser(isUser.user_id);

      const affectedRows = deleteUser.affected || 0;

      if (affectedRows > 0) return { message: 'User Deleted Successfully' };
      else return { message: 'User Already Deleted' };
    } catch (error) {
      throw error;
    }
  }

  async updateProfilePic(updateProfilePicDto: UpdateProfilePicDto) {
    try {
      const { profilePic, ref_userId, email, role } = updateProfilePicDto;

      //check user exists

      const isUser = await this.userRepository.findUserWithRef({
        ref_userId,
        email,
        role,
      });
      // Logger.log('Update User', JSON.stringify(isUser));

      if (!isUser) {
        throw new NotFoundException('User Not Found');
      }

      const updateProfilePic = await this.userRepository.updateProfilePic(
        isUser.user_id,
        profilePic,
      );

      const affectedRows = updateProfilePic.affected || 0;

      this.rabbitMQService.updateProfilePic(isUser.user_id, profilePic);
      Logger.log('exit');

      if (affectedRows > 0)
        return { message: 'Profile Pic Updated Successfully' };
      else return { message: 'User Not Found' };
    } catch (error) {
      throw error;
    }
  }

  async userProfile(userProfileDto: UserProfileDto) {
    try {
      const { user_id } = userProfileDto;

      Logger.log(userProfileDto);

      const user = await this.userRepository.userProfile(user_id);

      if (!user) {
        throw new NotFoundException('User Not Found');
      }

      Logger.log('USER PRFOLE', user.userData);

      return {
        message: 'User Profile Success',
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }
}
