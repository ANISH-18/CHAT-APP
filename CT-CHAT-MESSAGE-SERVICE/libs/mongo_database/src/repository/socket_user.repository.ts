import { Socket_User } from "@MongoDB/models";
import { Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from 'mongoose';


export class Socket_UserRepository {

    constructor(@InjectModel(Socket_User.name) private socketUserModel: Model<Socket_User>){}



    async addSocketToUser(user_id: string, socketId: string){
        try {
            
            //If user exists store and replace socketId
            const result = await this.socketUserModel.findOneAndUpdate(
                {user_id: user_id},
                { $set: { socketId }},
                {new: true, upsert: true}
            )

            return result;
            //If not user create user_id and socketId

        } catch (error) {
            Logger.error("Error While AddSocketToUser")
            throw error;
        }
    }


    async removeSocketToUser(socketId: string, user_id: string){
        try {
            //If socketId exists remove user delete
            //nullify
            // const result = await this.socketUserModel.findOneAndUpdate(
            //     {user_id: user_id, socketId},
            //     {$set: { socketId: null}},
            //     {new: true}
            // )
            // return result;

            //delete 
            await this.socketUserModel.findOneAndDelete({
                user_id: user_id, socketId: socketId
            })
            
        } catch (error) {
            Logger.error("Error While removeSocketToUser")
            throw error;
        }
    }


    async getAllConectedUserSocket(){
        try {
            //get all connected users
            const users = await this.socketUserModel.find(
            {
                socketId: { $ne: null},
            },
            { user_id: 1, socketId: 1, _id: 0 }
            );
            return users;
        } catch (error) {
            Logger.error("Error while getAllCOnnectedUserSocket")
            throw error;
        }
    }

    async getSocketId(user_id: string){
        try {
            // based on user_id return socketId
            const user = await this.socketUserModel.findOne({user_id: user_id})
            return user ? user.socketId : null;

        } catch (error) {
            Logger.error("Error while getSocketId")
            throw error;
        }
    }

    async deleteAll(){
        try {
            //delete all connection when application restarts
            await this.socketUserModel.deleteMany({}); 
        } catch (error) {
            Logger.error("Error while deleteAll")
            throw error;
        }
    }

}