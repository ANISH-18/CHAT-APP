import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation, Message, User } from '@MongoDB/models';
import { Logger } from '@nestjs/common';

export class ConversationRepository {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  //CREATE CONVERSATION REST API
  async createConv(input, user_id) {
    const { type, participants } = input;
    return await this.conversationModel.create({
      type: type,
      participants: participants,
      createdBy: user_id,
    });
  }

  //CREATE ROOM VIA REST HTTP
  async createRoom(type, participants, user_id, role) {
    return await this.conversationModel.create({
      type: type,
      participants: participants,
      createdBy: user_id,
      unSeenCount: 0,
      lastUpdatedBy: user_id,
      role: role,
      lastMessageAt: Date.now(),
    });
  }

  //CHECK CONV BETWEEN THE USERS
  async findConv(sender_id: string, user_id: string) {
    try {
      return await this.conversationModel.findOne({
        participants: { $all: [sender_id, user_id] },
      });
    } catch (error) {
      throw error;
    }
  }

  //FIND ROOM VIA REST HTTP
  async findRoom(
    selfRole: number,
    user_id: string,
    oppRole: number,
    page: number,
    recordsPerPage: number,
    search?: string,
  ) {
    try {
      //Empty obj

      const skip = (page - 1) * recordsPerPage;
      let conversations: any;
      let conversations_count: any;
      if (search) {
        let userFilter = {};

        const searchRegex = new RegExp(search, 'i');
        userFilter = {
          // $or: [
          //   { firstName: { $regex: searchRegex } },
          //   { lastName: { $regex: searchRegex } },
          // ],
          $and: [
            {
              $or: [
                { firstName: { $regex: searchRegex } },
                { lastName: { $regex: searchRegex } },
              ],
            },
            { _id: { $ne: user_id } }, // Exclude the current user's ID
          ],
        };

        //Search the Users
        const users = await this.userModel.find(userFilter).exec();

        // Logger.log('Users fetcehted', users);

        const userIds = users.map((user) => user._id);

        //Search the filtered userIds old v1
        // const conversations = await this.conversationModel
        //   .find({
        //     participants: { $in: userIds },
        //     role: { $in: [role] },
        //   })
        //   .populate('participants');

        // v2 change in role condition if role provided then return with role condition
        const conversationQuery: any = {
          participants: { $in: userIds },
        };
        if (oppRole !== undefined) {
          conversationQuery.role = { $in: [oppRole] };
        }

        conversations = await this.conversationModel
          .find(conversationQuery)
          .populate('participants')
          .skip(skip)
          .limit(recordsPerPage);

        conversations_count = await this.conversationModel
          .count(conversationQuery)
          .populate('participants');

        Logger.log(
          'conversations_count_______________________________________________________',
          conversations_count,
        );
        // return conversations;
      } else {
        //v1
        // const conversations = await this.conversationModel
        //   .find({
        //     participants: { $in: [user_id] },
        //     role: { $in: [role] },
        //   })
        //   .populate('participants');

        // v2 change in role condition if role provided then return with role condition
        console.log('role op', oppRole);
        console.log('role sefls', selfRole);

        const conversationQuery: any = {
          participants: { $in: [user_id] },
        };
        if (selfRole === oppRole) {
          // console.log('Same role');

          conversationQuery.role = { $eq: [selfRole, selfRole] };
        } else if (oppRole !== undefined) {
          // console.log('different');

          // If selfRole and oppRole are different, fetch conversations where the role array contains both
          conversationQuery.role = { $all: [selfRole, oppRole] };
        }
        Logger.log('query', JSON.stringify(conversationQuery));

        conversations_count = await this.conversationModel.countDocuments(
          conversationQuery,
        );

        conversations = await this.conversationModel
          .find(conversationQuery)
          .populate('participants')
          .skip(skip)
          .limit(recordsPerPage);
      }
      // console.log('conver', conversations);
      // console.log('totalConver', conversations_count);
      // console.log('currentCount', conversations.length);

      const nextPageAvailable =  skip + recordsPerPage < conversations_count;
      const prevPageAvailable = skip > 0;
      // console.log('next', nextPageAvailable);
      // console.log('prev', prevPageAvailable);
      
      

      // return conversations;
      return {
        conversations: conversations,
        totalCount: conversations_count,
        count: conversations.length,
        nextPageAvailable,
        prevPageAvailable
      }
    } catch (error) {
      throw error;
    }
  }

  async updateUnSeenCount(
    conversation_id: string,
    store: number,
    user_id: string,
    lastMessageAt: number,
    lastMessage: object,
    lastMessage_copy: string,
  ) {
    try {
      return await this.conversationModel.updateOne(
        { _id: conversation_id },
        {
          $inc: { unSeenCount: store },
          $set: {
            lastUpdatedBy: user_id,
            lastMessageAt: lastMessageAt,
            lastMessage: lastMessage,
            lastMessage_copy: lastMessage_copy,
          },
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async updateSeenCount(conversation_id: string, user_id: string) {
    try {
      // Logger.log('Conversation_id', conversation_id);
      return await this.conversationModel.updateOne(
        { _id: conversation_id, lastUpdatedBy: { $ne: user_id } },
        { $set: { unSeenCount: 0 } },
      );
    } catch (error) {
      throw error;
    }
  }

  async getCount(conversation_id: string) {
    try {
      return await this.conversationModel
        .findOne({ _id: conversation_id })
        .populate('participants');
      // .select('_id unSeenCount lastUpdatedBy createdAt updatedAt');
    } catch (error) {
      throw error;
    }
  }
}
