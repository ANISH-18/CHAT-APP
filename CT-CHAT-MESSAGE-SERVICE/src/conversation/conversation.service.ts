import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateConvDto } from './dto/create-conversation.dto';
import { ConversationRepository } from '@MongoDB/repository';
import { JoinAllConversationDto } from 'src/message/dto/join-conversation.dto';
import { CustomSocket } from 'src/message/middleware/custom-socket';
import { NotificationQueueService } from '@rabbitmq/notifications.service';

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly notificationService: NotificationQueueService,
  ) {}

  async createConv(input: CreateConvDto, user_id: string) {
    try {
      input.participants.push(user_id);

      const createC = await this.conversationRepository.createConv(
        input,
        user_id,
      );

      return {
        message: 'Conversation Created Successfully',
        data: createC,
      };
    } catch (error) {
      throw error;
    }
  }

  async findConv(sender_id: string, user_id: string) {
    try {
      // console.log(sender_id, user_id);

      const checkConv = await this.conversationRepository.findConv(
        sender_id,
        user_id,
      );

      if (!checkConv) {
        throw new NotFoundException('NOT FOUND CONVERSATION');
      }
      return {
        message: 'Data Fetched',
        data: checkConv,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateUnSeenCount(conversation_id: string, user_id: string, lastMessage: object, lastMessage_copy: string) {
    try {
      const store: number = 1;
      const lastMessageAt = Date.now();

      // const updateUnSeenCount =
      await this.conversationRepository.updateUnSeenCount(
        conversation_id,
        store,
        user_id,
        lastMessageAt,
        lastMessage, //encrypted message
        lastMessage_copy //plain message
      );
      // return updateUnSeenCount;
    } catch (error) {
      throw error;
    }
  }

  async updateSeenCount(conversation_id: string, client: CustomSocket) {
    try {
      const updateSeenCount = await this.conversationRepository.updateSeenCount(
        conversation_id,
        client.user_id
      );

      // Update in Notification
     // Logger.log('Update COunt');
      const { user_id } = client;
      await this.notificationService.updateCount({ conversation_id, user_id });

      return updateSeenCount;
    } catch (error) {
      throw error;
    }
  }

  async getCount(conversation_id: string) {
    try {
      const count = await this.conversationRepository.getCount(conversation_id);

      return count;
    } catch (error) {
      throw error;
    }
  }

  async getConversations(
    client: CustomSocket,
    joinAllConversationDto: JoinAllConversationDto,
  ) {
    try {
      const { user_id } = client;
      const { receiver_id } = joinAllConversationDto;

      const findRoom = await this.conversationRepository.findConv(
        user_id,
        receiver_id,
      );

      return findRoom;
    } catch (error) {
     // Logger.log('INSIDE CONVERSATION SERVICE');
      throw error;
    }
  }

  async findConversation(sender_id: string, user_id: string) {
    try {
      const checkConv = await this.conversationRepository.findConv(
        sender_id,
        user_id,
      );

      if (!checkConv) {
        throw new NotFoundException('NOT FOUND CONVERSATION');
      }
      return checkConv;
    } catch (error) {
      throw error;
    }
  }
}
