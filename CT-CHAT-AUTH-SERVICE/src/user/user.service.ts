import { UserRepository } from '@database';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async updateUser(event: any) {
    try {
      //   Logger.log('EVENT', event);
      //update user

      const { firstName, email, lastName } = event.updateUser;

      await this.userRepository.updateUser(event.user_id, {
        firstName,
        email,
        lastName,
      });
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

  async verifyChatEnable(user_id: string){
    try {
      Logger.log("Verifying chat enable")
      const result = await this.userRepository.verifyChatEnable(user_id);
      return result;
    } catch (error) {
      Logger.error("Error While Verifying Chat Enable")
      throw error;
    }
  }
}
