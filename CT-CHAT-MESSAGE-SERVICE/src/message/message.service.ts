import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from '@MongoDB/models';
import { Server } from 'socket.io';
import {
  ConversationRepository,
  MessageRepository,
  UserMongoRepo,
} from '@MongoDB/repository';
import { RoomDto } from './dto/join-room.dto';
import { TYPE, SENT } from '@helpers/chat.constant';
// import { isToday, isYesterday, isSameDay } from 'date-fns';
import { Message } from '@MongoDB/models';
import { MarkAsViewedDto } from './dto/markAsViewed.dto';
import { ConversationType } from 'src/conversation/types/types';
import { ReadReceiptDto } from './dto/readReceipt.dto';
import { FindRoomDto } from './dto/find-room.dto';
import { ClientProxy } from '@nestjs/microservices';
import { RabbitMQService } from '@rabbitmq/rabbitmq.service';
import { CustomSocket } from './middleware/custom-socket';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly userRepository: UserMongoRepo,
    private readonly rabbitmqService: RabbitMQService, // @Inject('USER_SERVICE') private readonly user_queue: ClientProxy,
  ) {}

  async sendMessage(input: CreateMessageDto, client: CustomSocket) {
    try {
      // const { _id } = user;
      const { user_id } = client;

      const { receiver_id } = input;

      //Check Conversation
      const checkRoom = await this.conversationRepository.findConv(
        receiver_id,
        user_id,
      );

      if (!checkRoom) {
        const checkReciever = await this.userRepository.findByUserId(
          receiver_id,
        );

        const participant = [receiver_id, user_id];

        const role = [client.role, checkReciever.role];

        const createRoom = await this.conversationRepository.createRoom(
          TYPE.OneToOne,
          participant,
          user_id,
          role,
        );
        return this.messageRepository.sendMEssage(
          input,
          user_id,
          SENT,
          createRoom._id,
        );
      }

      return this.messageRepository.sendMEssage(
        input,
        user_id,
        SENT,
        checkRoom._id,
      );
    } catch (error) {
      throw error;
    }
  }

  // Find Chat
  //SORTING WITH DATE WISE OBJ
  async findChat(payload: RoomDto) {
    try {
      const chats = await this.messageRepository.findChat(payload);

      // Group messages by date
      //Move it in helper class
      const groupedMessages = {};

      chats.forEach((chat) => {
        const messageDate = new Date(chat.createdAt);

        // Format the date
        const dateString = messageDate.toISOString().split('T')[0];

        // Create the grouped structure
        groupedMessages[dateString] = groupedMessages[dateString] || {
          date: dateString,
          data: [],
        };

        groupedMessages[dateString].data.push({
          chat,
        });
      });
      const result = Object.values(groupedMessages);

      const fetchedUser = await this.messageRepository.findMessageCount(
        payload.room_id,
      );

      const data = {
        result,
        totalMessagesCount: fetchedUser,
      };

      return data;
    } catch (error) {
      throw error;
    }
  }

  //FIND ROOM
  async findRoom(client: CustomSocket, findRoomDto: FindRoomDto) {
    try {
      const { user_id, role } = client;
      const { getRole, search, page, recordsPerPage } = findRoomDto;
      // console.log('before');
      

      const findRoom = await this.conversationRepository.findRoom(
        role,
        user_id,
        getRole,
        page,
        recordsPerPage ,
        search
      );
      // console.log('findRomm', findRoom);
      

      return findRoom;
    } catch (error) {
      throw error;
    }
  }

  //READ RECEIPT
  //CHECK IF USER IS RECEIVER FOR THE MESSAGE
  //IF RECEIVER THEN UPDATE THE MESSAGE STATUS
  //Not used
  async markAsViewed(markAsViewDto: MarkAsViewedDto, user: User) {
    try {
      const { messages } = markAsViewDto;

      const updatedMessages: Message[] = [];

      for (const singleMarkDto of messages) {
        const { messageId } = singleMarkDto;
        // Logger.log('Update The View Status', messageId);

        const checkReceiver = await this.messageRepository.findUser(
          messageId,
          user,
        );
        // Logger.log('Check Receiver', checkReceiver);

        if (!checkReceiver) {
          return checkReceiver;
        }

        // Logger.log('USER IS RECEIVER');

        if (checkReceiver) {
          const updateMessageStatus =
            await this.messageRepository.updateMessageStatus(messageId);

          if (updateMessageStatus) {
            updatedMessages.push(updateMessageStatus);
          }
        }
      }

      // Logger.log('Processing complete');
      return updatedMessages;
    } catch (error) {
      throw error;
    }
  }

  async updateOnlineStatus(user_id: string, status: number) {
    try {
      //Update Message Service
      const statusUpdated = await this.userRepository.updateOnlineStatus(
        user_id,
        status,
      );

      const userStatus = {
        user_id,
        status,
      };

      //Update in User Service Using TCP
      try {
        this.rabbitmqService.handelOnlineStatus(userStatus);
      } catch (error) {
        throw error;
      }
      return statusUpdated;
    } catch (error) {
      throw error;
    }
  }

  async markReadReceipt(client: CustomSocket, conversation_id: string) {
    try {
      const { user_id } = client;

      const markReadReceipt = await this.messageRepository.markReadReceipt(
        user_id,
        conversation_id,
      );

      return markReadReceipt;
    } catch (error) {
      throw error;
    }
  }

  //Test Method to handle load
  async handelMessage(server: Server, messageDto: any) {
   // Logger.log('messge, u', JSON.stringify(messageDto));

    for (let i = 0; i < 500; i++) {
      //Logger.log('VALUE', JSON.stringify(i));
     // server.emit('message.queue', messageDto);
    }
  }
}
