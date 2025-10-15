import { Socket_UserRepository } from "@MongoDB/repository";
import { Injectable, Logger } from "@nestjs/common";



@Injectable()
export class socketService{

    constructor(private sockerUserRepository: Socket_UserRepository){}


    async addSocket(user_id: string, socketId: string){
        try {
            Logger.log("Socket add eventin service______________________________",user_id+" "+socketId)
            const result = await this.sockerUserRepository.addSocketToUser(user_id, socketId)
            if(!result)
            {
                Logger.log("Result info", JSON.stringify(result))
            }
            Logger.log("Result Info, ", JSON.stringify(result))
            return result;
        } catch (error) {
            Logger.error("Error while adding")
            throw error;
        }
    }


    async removeSocket(socketId: string, user_id: string){
        try {
            Logger.log("removeSocket removing userId and socketId____________________________________________",user_id+"  "+ socketId)
            Logger.log("removeSocket removing userId and socketId____________________________________________",user_id+"  "+ socketId)
            Logger.log("removeSocket removing userId and socketId____________________________________________",user_id+"  "+ socketId)
            const result = await this.sockerUserRepository.removeSocketToUser(socketId, user_id)
            return result
        } catch (error) {
            Logger.error("WHile removing ")
            throw error;
        }
    }


    async getSocketId(user_id: string){
        try {
            Logger.log("Get Socket id for user_id", user_id)
            const socketId = await this.sockerUserRepository.getSocketId(user_id);
            Logger.log(`Socket id ${socketId} for userId : ${user_id}`)
            return socketId;


        } catch (error) {
            Logger.error("get Socket id error")
            throw error;
        }
    }
    

    async getConnectedUser(){
        try {
            Logger.log("All Users")
            return  await this.sockerUserRepository.getAllConectedUserSocket();


        } catch (error) {
            Logger.error("Error to get All usersocket")
            throw error;
        }
    }


    async deleteAllWhenReboot(){
        try {
            Logger.log("Initiating All User Delete")
            await this.sockerUserRepository.deleteAll();
        } catch (error) {
            Logger.error("Error While Rebooting ")
            throw error;
        }
    }
}