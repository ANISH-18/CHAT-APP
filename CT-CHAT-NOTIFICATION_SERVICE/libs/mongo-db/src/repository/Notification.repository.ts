import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../models';
import { Logger } from '@nestjs/common';

export class NotificationRepository {
  constructor(
    @InjectModel(Notification.name)
    private notifcationModel: Model<Notification>,
  ) {}

  async findNotification(
    authorId: string,
    recipientId: string,
    conversationId: string,
  ) {
    try {
      return await this.notifcationModel.findOne({
        authorId: authorId,
        recipentId: recipientId,
        conversationId: conversationId,
      });
    } catch (error) {
      throw error;
    }
  }

  async createNotification(
    author: any,
    recipient: any,
    conversationId: string,
  ) {
    try {
      const notification = await this.notifcationModel.create({
        authorId: author._id,
        authorFirstName: author.firstName,
        authorLastName: author.lastName,
        authorEmail: author.email,
        authorProfilePic: author.profilePic,
        authorRole: author.role,
        recipentId: recipient._id,
        recipentFirstName: recipient.firstName,
        recipentLastName: recipient.lastName,
        recipentEmail: recipient.email,
        recipentProfilePic: recipient.profilePic,
        recipentRole: recipient.role,
        type: 1,
        conversationId: conversationId,
        sentAt: new Date(),
      });

      return notification;
    } catch (error) {
      throw error;
    }
  }

  async updateCount(id: any) {
    try {
      return await this.notifcationModel.updateOne(
        {
          _id: id,
        },
        { 
          $inc: { count: 1 },
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async findPendingNotify(email: string, role: number) {
    try {
      Logger.log("Querying Pending Notifications ")
      return await this.notifcationModel.find({
        recipentEmail: email,
        recipentRole: role,
        count: { $gt: 0 },
      }    
    )
    .sort({ updatedAt: -1 });
  
    } catch (error) {
      throw error;
    }
  }

  async updateSeenCount(conversation_id: string, user_id: string) {
    try {
      return await this.notifcationModel.updateOne(
        {
          conversationId: conversation_id,
          recipentId: user_id,
        },
        { $set: { count: 0 } },
      );
    } catch (error) {
      throw error;
    }
  }


  async updateAuthor(user_id: string, updateUser: any){
    try {
      Logger.log("Updating author........")
      await this.notifcationModel.updateMany(
        {authorId: user_id},
        updateUser,
      )
    } catch (error) {
      Logger.error("Failed to Update Author")
      throw error;
    }
  }

  async updateRecipent(user_id: string, updateUser: any){
    try {
      Logger.log("Updating recipent........")
      await this.notifcationModel.updateMany(
        {recipentId: user_id},
        updateUser,
      )
    } catch (error) {
      Logger.error("Failed to Update Author")
      throw error;
    }
  }
}
