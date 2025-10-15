import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../models';
import { Logger } from '@nestjs/common';

export class UserMongoRepo {
  constructor(@InjectModel(User.name) private userMOdel: Model<User>) {}

  async findAll() {
    return this.userMOdel.find();
  }

  async findByEmail(user_id) {
    return this.userMOdel.findOne({ user_id });
  }

  async createUser(input: any) {
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
    } = input;

    return await this.userMOdel.create({
      _id: user_id,
      username: username,
      firstName: firstName,
      lastName: lastName,
      profilePic: profilePic,
      email: email,
      org_id: org_id,
      role: role,
      businessName: businessName,
      userData: userData,
    });
    //
  }

  async findByUserId(user_id: string) {
    const user = await this.userMOdel.findOne({ _id: user_id });

    return user;
  }

  async updateOnlineStatus(user_id: string, status: number) {
    // Logger.log('user_id', user_id, 'status', status);
    return await this.userMOdel.updateOne(
      { _id: user_id },
      { $set: { isOnline: status } },
    );
  }

  async updateUser(user_id: string, data: any) {
    const result = await this.userMOdel.updateOne({ _id: user_id }, data);
    return result;
  }

  async deleteUser(user_id: string) {
    await this.userMOdel.updateOne(
      { _id: user_id },
      { $set: { deletedAt: new Date() } },
    );
  }

  async updateUserProfilePic(user_id: string, profilePic: string) {
    return await this.userMOdel.updateOne(
      {
        _id: user_id,
      },
      {
        $set: { profilePic: profilePic },
      },
    );
  }
}
