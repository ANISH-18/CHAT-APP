import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from 'mongoose';

export type Socket_UserDocument = HydratedDocument<Socket_User>;
@Schema({
    autoIndex: true,
    timestamps: true
})
export class Socket_User {


    @Prop({required: true})
    user_id: string;

    @Prop({required: false})
    socketId: string;

}

export const Socket_UserSchema = SchemaFactory.createForClass(Socket_User);