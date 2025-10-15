import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisConnectionService {
  constructor(@InjectRedis() private readonly client: Redis) {}

  //Multi
  // async setUserSocket(userId: string, socketId: string) {
  //   try {
  //     // Add the socket ID to a Redis Set for the user
  //     await this.client.hset('users', userId, JSON.stringify(await this.addSocketToUser(userId, socketId)));
  //     Logger.log(`Added socket ID ${socketId} for user ${userId}`);
  //     return true;
  //   } catch (error) {
  //     Logger.error(`Error adding socket ID ${socketId} for user ${userId}`, error);
  //     throw error;
  //   }
  // }

  // private async addSocketToUser(userId: string, socketId: string): Promise<string[]> {
  //   const userSockets = await this.getUserSockets(userId);
  //   if (!userSockets.includes(socketId)) {
  //     userSockets.push(socketId);
  //   }
  //   return userSockets;
  // }

  async setUserSocket(userId: string, socketId: string) {
    const exists = await this.client.exists('users');
    if (exists === 0) {
      await this.client.hset('users', userId, socketId);
    } else {
      // If the key exists and is a hash, set the user socket
      await this.client.hset('users', userId, socketId);
    }
    return true;
  }
  //Multi
  // async getUserSockets(userId: string): Promise<string[]> {
  //   try {
  //     const sockets = await this.client.hget('users', userId);
  //     return sockets ? JSON.parse(sockets) : [];
  //   } catch (error) {
  //     Logger.error(`Error fetching sockets for user ${userId}`, error);
  //     throw error;
  //   }
  // }

  async removeUserSocket(userId: string) {
    const removeUserSocket = this.client.hdel('users', userId);

    return removeUserSocket;
  }

  //Multi
  // async removeSocketId(socketId: string) {
  //   try {
  //     const users = await this.getAllConnectedUsersV2();

  //     for (const { userId, socketIds } of users) {
  //       if (socketIds.includes(socketId)) {
  //         const updatedSockets = socketIds.filter((id) => id !== socketId);

  //         if (updatedSockets.length > 0) {
  //           await this.client.hset('users', userId, JSON.stringify(updatedSockets));
  //         } else {
  //           await this.client.hdel('users', userId); // Remove the user key if no sockets remain
  //         }

  //         Logger.log(`Removed socket ID ${socketId} for user ${userId}`);
  //         return true;
  //       }
  //     }

  //     Logger.warn(`Socket ID ${socketId} not found`);
  //     return false;
  //   } catch (error) {
  //     Logger.error(`Error removing socket ID ${socketId}`, error);
  //     throw error;
  //   }
  // }

  // async getAllConnectedUsersV2() {
  //   const redisData = await this.client.hgetall('users');
  //   return Object.entries(redisData).map(([userId, sockets]) => ({
  //     userId,
  //     socketIds: JSON.parse(sockets), // Parse socket IDs stored as JSON strings
  //   }));
  // }

  async getAllConnectedUsers() {
    const redisData = await this.client.hgetall('users');

    const getAllConnectedUsers = Object.entries(redisData).map(
      ([userId, socketId]) => ({
        userId,
        socketId,
      }),
    );

    return getAllConnectedUsers;
  }

  async getSocketId(userId: string) {
    const getSocketId = this.client.hget('users', userId);

    return getSocketId;
  }

  async deleteAll(){
    try {
      Logger.log("Intiating Redis Data Deletion")
      let result = await this.client.del('users')
      result === 1; 
      Logger.log(result ? 'All users deleted.' : 'No users to delete.');
    } catch (error) {
      Logger.error("Error While Deleting redis-data")
      throw error;
    }
  }
}
