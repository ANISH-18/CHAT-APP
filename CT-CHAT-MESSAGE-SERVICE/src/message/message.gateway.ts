import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';
import { UseGuards, Logger } from '@nestjs/common';
import { WsTokenGuard, WsJwtGuard } from '@jwt_auth';
import { User } from '@MongoDB/models';
import { RoomDto } from './dto/join-room.dto';
import { SocketAuthMiddleware } from './middleware/ws.mw';
import { TypingDto } from './dto/typing.dto';
import { MarkAsViewedDto } from './dto/markAsViewed.dto';
import { ConversationService } from 'src/conversation/conversation.service';
import { ReadReceiptDto } from './dto/readReceipt.dto';
import { FindRoomDto } from './dto/find-room.dto';
import { ONLINE_STATUS } from '@helpers/chat.constant';
import { JoinAllConversationDto } from './dto/join-conversation.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { RoomUpdateReceiptDto } from './dto/joinRoom-updateReceipt.dto';
import { CustomSocket } from './middleware/custom-socket';
import { instrument } from '@socket.io/admin-ui';
import { RedisConnectionService } from 'redis-client/redis-client';
import { NotificationService } from './notification.service';
import { socketService } from './socketUserOnline.service';

@WebSocketGateway({
  cors: {
    // origin: ['https://chatapp.probizca.net/', 'https://admin.socket.io', '*'],
    //origin: ['https://dev.ct.chatmessageservice.onpointsoft.com/', 'https://admin.socket.io', '*'],

    origin: '*',
    credentials: true,
  },
  transports: ['websocket', 'polling'], 
  pinginterval: 10000,
  pingTimeout: 5000,  
  reconnectionAttempt: 3,
  reconnectionDelay: 3000,
})
// @UseGuards(WsTokenGuard)
export class MessageGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger: Logger;

  constructor(
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService,
    private readonly redisClient: RedisConnectionService,
    private readonly notifcationService: NotificationService,
    private readonly socketService: socketService
  ) {
    this.logger = new Logger(MessageGateway.name);
  }

  //SOCKET MIDDLEWARE TO AUTH USER BEFORE CONNNECTING
  //SOLVING ISSUE FROM GITHUB OPEN ISSUE NEST #882
  afterInit(client: Socket) {
    client.use(SocketAuthMiddleware() as any);

    instrument(this.server, {
      namespaceName: 'admin',
      auth: false,
    //  auth: {
    //   type: "basic",
    //   username: "admin",
    //   password: "$2b$10$heqvAkYMez.Va6Et2uXInOnkCT6/uQj1brkrbyG3LpopDklcq7ZOS" // "changeit" encrypted with bcrypt
    // },
      mode: 'development',
    });

    // this.redisClient.deleteAll();
    this.socketService.deleteAllWhenReboot();
  }

  // Online || Offline Event
  // IMPLEMENTED
  @SubscribeMessage('onlineUser')
  async findall(@ConnectedSocket() client: Socket) {
    // const onlineUsers = await this.redisClient.getAllConnectedUsers();
    const onlineUsers = await this.socketService.getConnectedUser();
    this.server.emit('onlineUser', onlineUsers);
  }

  //sendMessage TO server
  //Message TO STORE IN DB
  //Private Message Implemented
  //Ws Dependency removed
  @SubscribeMessage('createMessage')
  async sendMessage(
    @MessageBody() input: CreateMessageDto,
    @ConnectedSocket() client: CustomSocket,
  ) {
    const message = await this.messageService.sendMessage(input, client);

    //Refactored
    await (async () => {
      // const socketId = await this.redisClient.getSocketId(input.receiver_id);
      const socketId = await this.socketService.getSocketId(input.receiver_id);
      Logger.log(`Send Message => SocketId: ${socketId}, for userId ${input.receiver_id}`)
      Logger.log(socketId ? 'ONLINE USER' : 'OFFLINE USERS');
      return socketId
        ? this.handelOnlineReceiver(socketId, message, client)
        : this.handelOfflineReceiver(client, input, message);
    })();
  }

  //JOIN CONV ROOM WIHT THE OTHER USER's
  //Required room_id ("conversation_id") to fetch chat
  //Private Room Not Implemented
  //Ws Dependency removed
  @SubscribeMessage('joinRoom')
  async joinRoom(
    @ConnectedSocket() client: CustomSocket,
    @MessageBody() payload: RoomDto,
  ) {
    try {
      const chat = await this.messageService.findChat(payload);

      this.server.to(client.id).emit('joinedRoom', chat);

      //Set unseen count of the conversation to zero
      await this.conversationService.updateSeenCount(payload.room_id, client);

      // await this.messageService.markReadReceipt(user, payload.room_id);
    } catch (error) {
      throw error;
    }
  }

  //JOIN CONV ROOM WIHT THE OTHER USER's
  //Ws Dependency removed
  @SubscribeMessage('joinAllConversation')
  async joinAllConversation(
    @ConnectedSocket() client: CustomSocket,
    @MessageBody() joinAllConversationDto: JoinAllConversationDto,
  ) {
    try {
  
      const getConversations = await this.conversationService.getConversations(
        client,
        joinAllConversationDto,
      );

      //Logger.log('getConversations', getConversations);

      if (!getConversations) 
      {
        return this.server.to(client.id).emit("joinedRoom", {message: "NO Conversation Found"});
      }

      const room_id = getConversations._id.toString();

      const { page, pageSize } = joinAllConversationDto;

      const payload = {
        room_id: room_id,
        page: page,
        pageSize,
      };      
      const chat = await this.messageService.findChat(payload);
      this.server.to(client.id).emit('joinedRoom', chat);
  

    } catch (error) {
      Logger.error("Error In JoinAllConversation")
      throw error;
    }
  }

  //LEAVE ROOM COMPLETED
  //Ws Dependency removed
  @SubscribeMessage('leaveRoom')
  async leaveRoom(@ConnectedSocket() client: CustomSocket, payload: RoomDto) {
    const roomId = payload?.room_id;
    if (roomId) {
      client.leave(String(roomId));
      this.server.emit(`leaveRoom`, roomId);
    }
  }

  //FIND ROOMS (Find Conversation)
  //CONDITIONS ARE REMAINING
  //If not role fetch all
  //Ws Dependency removed
  @SubscribeMessage('findRoom')
  async findRoom(
    @ConnectedSocket() client: CustomSocket,
    @MessageBody() findRoomDto: FindRoomDto,
  ) {
    try {
      const findRooms = await this.messageService.findRoom(client, findRoomDto);
      // Logger.log(findRooms, 'FindRooms');
      this.server.to(client.id).emit('listRoom', findRooms);
    } catch (error) {
      throw error;
    }
  }

  // TYPING EVENT Implemented
  //TEST WITH FRONTEND INTEGRATION
  //Ws Dependency removed
  @SubscribeMessage('typing')
  async typing(
    @MessageBody() typingDto: TypingDto,
    @ConnectedSocket() client: CustomSocket,
  ) {
    const userId = client.user_id;
    const typing = {
      userId,
      isTyping: typingDto.isTyping,
    };

    // const socketId = await this.redisClient.getSocketId(typingDto.receiver_id);
    const socketId = await this.socketService.getSocketId(typingDto.receiver_id);
    Logger.log(`ReceiverId : ${typingDto.receiver_id}, SocketId: ${socketId}`)
    if (socketId) {
      Logger.log(`SocketId Present: ${socketId}, for receiverId: ${typingDto.receiver_id} ` )
      this.server.to(socketId).emit('typing', typing);
    }
  }

  //MARK AS VIEWED NOT IMPLEMENTED : Implemented on 1 April
  //ISSUE NOT SOLVED : Solved by adding "status" field in "message" model
  //CHECK IF THE USER IS RECEIVER IN MESSAGE_ID AND THEN MARK AS VIEWED
  //Ws Removed
  @SubscribeMessage('markAsViewed')
  async handleMarkAsViewed(
    @MessageBody() readReceiptDto: ReadReceiptDto,
    @ConnectedSocket() client: CustomSocket,
  ) {
    await this.messageService.markReadReceipt(
      client,
      readReceiptDto.conversation_id,
    );
  }

  //ReadReceipt changes done acc to uniqueId
  //ws removed
  @SubscribeMessage('readReceipt')
  async handleReadReceipt(
    @MessageBody() updateReceiptDto: UpdateReceiptDto,
    @ConnectedSocket() client: CustomSocket,
  ) {
    const { uniqueId, sender_id, status } = updateReceiptDto;

    const conversation = await this.conversationService.findConversation(
      sender_id,
      client.user_id,
    );

    const conversation_id = conversation._id.toString();

    const updateMessage = {
      uniqueId: uniqueId,
      status: status,
      conversation_id: conversation_id,
    };

    // Logger.log('Update Message', updateMessage);

    // const socketId = await this.redisClient.getSocketId(sender_id);
    const socketId = await this.socketService.getSocketId(sender_id);

    if (socketId) this.server.to(socketId).emit('viewReceipt', updateMessage);

    await Promise.all([
      this.conversationService.updateSeenCount(conversation_id, client),
      this.messageService.markReadReceipt(client, conversation_id),
    ]);

    //update the message count
    //Why getCount to user
    const getCount = await this.conversationService.getCount(conversation_id);

    this.server.to(client.id).emit('updateList', getCount);

    try {
    } catch (error) {
      throw error;
    }
  }

  //When a user joins a room and other user is active in room to maintain read receipt status
  @SubscribeMessage('updateReceipts')
  async updateReceipts(
    @ConnectedSocket() client: CustomSocket,
    @MessageBody() roomUpdateReceiptDto: RoomUpdateReceiptDto,
  ) {
    try {
      // const socketId = await this.redisClient.getSocketId(
      //   roomUpdateReceiptDto.receiver_id,
      // );
      const socketId = await this.socketService.getSocketId(roomUpdateReceiptDto.receiver_id);
      if (socketId) {
        this.server
          .to(socketId)
          .emit('updateRoomReceipt', roomUpdateReceiptDto);
      }

      await this.messageService.markReadReceipt(
        client,
        roomUpdateReceiptDto.conversation_id,
      );
    } catch (error) {
      throw error;
    }
  }

  //ping-Pong For dead connections
  @SubscribeMessage('ping')
  async handelPingPong(@ConnectedSocket() client: CustomSocket) {
    Logger.log('handelPingPong',client.id+ '  ' +client.user_id);
    this.server.to(client.id).emit('pong', {"client socket id": client.id});
    const get_socket_data = await this.socketService.getSocketId(client.user_id);
    this.messageService.updateOnlineStatus(
      client.user_id,
      ONLINE_STATUS.Online
    );
    if(!get_socket_data)
    {
      Logger.log('handelPingPong- socket not found in mongo for ____________________________*******',client.id+ '  ' +client.user_id);
      Logger.log('handelPingPong- socket not found in mongo for ____________________________*******',client.id+ '  ' +client.user_id); 
     
    
      this.socketService.addSocket(client.user_id, client.id)     
       
    }
  
  }

  //EMIT CLIENT SOCKET DISCONNECT
  async handleDisconnect(client: CustomSocket): Promise<void> {
    //REMOVE SOCKET ID FROM REDIS
    // this.redisClient.removeUserSocket(client.user_id);
    //Mongo Store
    Logger.log("handleDisconnect removing userId and socketId______________________________________________",client.user_id+"  "+ client.id)

    await this.socketService.removeSocket(client.id, client.user_id)

    console.log(`Client Socket disconnected: ${client.id}`);
    console.log(`Client User disconnected: ${client.user_id}`);
    console.log(`client Role disconnected: ${client.role}`);

    // const onlineUsers = await this.redisClient.getAllConnectedUsers();
    const onlineUsers = await this.socketService.getConnectedUser();
    this.server.emit('onlineUser', onlineUsers);

     // Check if any other socket IDs exist for this user
     const remainingSocketId = await this.socketService.getSocketId(client.user_id);
     if (!remainingSocketId) {
      console.log(`No socket id found of user, so emit isUserOnline status offline,${client.user_id}`);
      const user = {
        user_id: client.user_id,
        isOnline: ONLINE_STATUS.Offline
      }
      //Emit the UserId & isOnline Status
      this.server.emit('isUserOnline', {participants: user})
  
      // Update the online status of the disconnected user in the database
      this.messageService.updateOnlineStatus(
        client.user_id,
        ONLINE_STATUS.Offline,
      );
     }
    
  }

  //EMIT CLIENT SOCKET CONNECT
  handleConnection(client: CustomSocket, ...args: any[]): void {
    console.log(`Client Socket connected: ${client.id}`);
    console.log(`client user connnect: ${client.user_id}`);
    console.log(`client Role connnect: ${client.role}`);

    const user = {
      user_id: client.user_id,
      isOnline: ONLINE_STATUS.Online
    }
    //Emit the UserId & isOnline Status
    this.server.emit('isUserOnline', {participants: user})

    //Store userId and SocketId in Redis
    // this.redisClient
    //   .setUserSocket(client.user_id, client.id)
    //   .then((success) => Logger.log('SUCCESS'))
    //   .catch((err) => Logger.error(err));

    //store in mongo
    this.socketService.addSocket(client.user_id, client.id);
    
    //Update online status over other service
    this.messageService.updateOnlineStatus(
      client.user_id,
      ONLINE_STATUS.Online,
    );
  }

  @SubscribeMessage('reconnect')
  handleReconnection(client: CustomSocket, ...args: any[]):void {
    try {
      console.log(`Client Socket Re-connected: ${client.id}`);
      console.log(`client user Re-connnect: ${client.user_id}`);
      console.log(`client Role Re-connnect: ${client.role}`);

      const user = {
        user_id: client.user_id,
        isOnline: ONLINE_STATUS.Online
      }
      this.server.emit('isUserOnline', {participants: user});

      //Store userId and SocketId in Redis
      // this.redisClient
      // .setUserSocket(client.user_id, client.id)
      // .then(() => Logger.log('Re-Connect SUCCESS'))
      // .catch((err) => Logger.error(err));
     
      this.socketService.addSocket(client.user_id, client.id)

      //Update online status over other service
      this.messageService.updateOnlineStatus(
          client.user_id,
          ONLINE_STATUS.Online,
      );

    } catch (error) {
      Logger.error("Error While Reconnecting to Server...")
      throw error;
    }
  }

  @SubscribeMessage('sendQ')
  async handelMessage(
    @MessageBody() message: any,
    @ConnectedSocket() client: CustomSocket,
  ) {
    // this.messageService.handelMessage(this.server, messageDto);
    const { user } = message;
    Logger.log(message, "user payload")

    // const data = await this.redisClient.getSocketId(user);
    const data = await this.socketService.getSocketId(message.user);
    Logger.log("user", data)

    this.server.to(data).emit('messagequeue', `HELLO USER ${user}`);
  }

  //Implement Promise.all to emit and updateUnseenCount
  private async handelOnlineReceiver(
    socketId: string,
    message: any,
    client: CustomSocket,
  ) {
    try {
      if (socketId) this.server.to(socketId).emit('message', message);

      await this.conversationService.updateUnSeenCount(
        message.conversation_id,
        client.user_id,
        message.content, //encrypted message
        message.content_copy //plain message
      );
      //Logger.log('INSIDE handelOnlineReceiver 2');
      //update the message count
      const getCount = await this.conversationService.getCount(
        message.conversation_id,
      );

      //emit the message count
      if (socketId) this.server.to(socketId).emit('updateList', getCount);
      //Logger.log('INSIDE handelOnlineReceiver 3');
       //Send Notification
       let isActive = true;
       this.notifcationService.sendNotification(
        client.user_id,
        message.receiver_id,
        message._id.toString(),
        message.conversation_id,
        message.content,
        message.content_copy,
        isActive,
      );

     
    } catch (error) {
      //Logger.log('error', error);
      throw error;
    }
  }

  //Implement Promise.all to do both execution
  private async handelOfflineReceiver(
    client: CustomSocket,
    input: any,
    message: any,
  ) {
    try {
      //Logger.log('INSIDE handelOfflineReceiver 1');
      //Send Notification
      let isActive = false;
       this.notifcationService.sendNotification(
        client.user_id,
        input.receiver_id,
        message._id.toString(),
        message.conversation_id,
        message.content,
        message.content_copy,
        isActive,
      );
      //Logger.log('INSIDE handelOfflineReceiver 2');
      //Update Count
      await this.conversationService.updateUnSeenCount(
        message.conversation_id,
        client.user_id,
        message.content, //encrypted message
        message.content_copy //plain message
      );
      //Logger.log('INSIDE handelOfflineReceiver 3');
    } catch (error) {
      throw error;
    }
  }


  async broadcastUserOnlineStatus(userStatus: { user_id: string; isOnline: number }) {
    Logger.log("broadcastUserOnlineStatus _____________________________________________ ", userStatus)
    this.server.emit('isUserOnline', { participants: userStatus });

    if(userStatus.isOnline === 0)
    {
      //search the online user socketId 
      const getSocketId = await this.socketService.getSocketId(userStatus.user_id);
      if(!getSocketId)
      {
        Logger.error("No Socket Id found for user to make it offline")
      }
      this.server.to(getSocketId).emit('clearSession',{message: "Your session has been cleared due to logout or inactivity."})

      const socket = this.server.sockets.sockets.get(getSocketId);
      if (socket) {
        socket.disconnect(true); // Force disconnect the socket
        Logger.log(`Socket ID ${getSocketId} disconnected successfully`);
      } else {
        Logger.error(`Socket with ID ${getSocketId} not found for disconnection`);
      }

    }
  }


  async disableUser(user_id: string){
    try {
      const getSocketId = await this.socketService.getSocketId(user_id);
      if(!getSocketId)
      {
        Logger.log("-------------User is Offline No Need to disable ACtive Session--------------------")
      }
      this.server.to(getSocketId).emit("disbale-Org", {message: "Your Session has been cleared due to Organization InActive"})
      
      const socket = this.server.sockets.sockets.get(getSocketId);
      if(socket)
      {
        socket.disconnect(true); //force disconnect
        Logger.log(`Session revoked for ${socket} and ${user_id}`)
      }
    } catch (error) {
      Logger.error("Failed to disable the user")
      throw error;
    }
  }
}
