import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, User } from '../models';
import { Logger } from '@nestjs/common';
import { MESSAGE_STATUS } from '@helpers/chat.constant';

export class MessageRepository {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  //send Message
  async sendMEssage(input, user_id, sent, conversation_id) {
    const { receiver_id, content, content_copy, uniqueId } = input;

    //change flag from sent to status

    return await this.messageModel.create({
      content: content,
      content_copy: content_copy,
      sender_id: user_id,
      uniqueId: uniqueId,
      receiver_id: receiver_id,
      status: sent,
      conversation_id: conversation_id,
    });
  }

  //find Chat with between user's
  //PAGINATION APPLIED
  async findChat(payload: any) {
    try {
      const { room_id, page, pageSize } = payload;

      // const totalMessagesCount = await this.messageModel.countDocuments({
      //   conversation_id: room_id,
      // });

      // Logger.log('Total Messages Count: ' + totalMessagesCount);

      const messages = await this.messageModel
        .find({ conversation_id: room_id })
        .sort({ createdAt: 'desc' })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec();

      return messages;
    } catch (error) {
      throw error;
    }
  }

  //FIND USER IN CONVERSATION
  async findUser(messageId: string, user: User) {
    try {
      const { _id } = user;
      const checkReceiver = await this.messageModel.findOne({
        _id: messageId,
        receiver_id: _id,
      });

      // Logger.log('checkReceiver', checkReceiver);
      return checkReceiver;
    } catch (error) {
      throw error;
    }
  }

  //FIND MESSAGE COUNT OF A CONVERSATION
  async updateMessageStatus(messageId: string) {
    return await this.messageModel.findByIdAndUpdate(
      { _id: messageId },
      { $set: { status: MESSAGE_STATUS.Viewed } },
      { new: true },
    );
  }

  //FIND MESSAGE COUNT
  async findMessageCount(room_id: string) {
    try {
      // Logger.log('room_id is it here ', room_id);
      const totalMessagesCount = await this.messageModel.countDocuments({
        conversation_id: room_id,
      });
      return totalMessagesCount;
    } catch (error) {
      throw error;
    }
  }

  async markReadReceipt(user_id: string, conversation_id: string) {
    try {
      // Logger.log('conversation_id', conversation_id);
      // Logger.log('user_id', user_id);

      return await this.messageModel.updateMany(
        {
          conversation_id: conversation_id,
          receiver_id: user_id,

          status: MESSAGE_STATUS.Sent,
        },
        {
          status: MESSAGE_STATUS.Viewed,
        },
      );
    } catch (error) {
      throw error;
    }
  }
}
