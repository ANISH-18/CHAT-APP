import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export interface UserData {
  referredId: number;
  referredRole: number;
  businessName: string;
  parent_id: number;
  isActive: boolean;
}
export type UserDocument = HydratedDocument<User>;
@Schema({
  autoIndex: true,
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
    type: String,
    default: () => new Types.ObjectId().toString(),
  })
  _id: string;

  @Prop({ required: false, type: String })
  firstName: string;

  @Prop({ required: false, type: String })
  lastName: string;

  @Prop({ required: false, type: String })
  businessName: string;

  @Prop({ required: false, type: Array })
  userData: UserData[];

  @Prop({ required: false, type: String })
  profilePic: string;

  @Prop({ required: false, type: String })
  username: string;

  @Prop({ required: false, type: String })
  email: string;

  @Prop({ required: false, type: Number })
  org_id: number;

  @Prop({ required: false, type: Number })
  role: number;

  @Prop({ required: false, type: Number })
  parent_id: number;

  @Prop({ required: false, type: Number })
  isOnline: number;

  @Prop({ required: false, type: String })
  fcmToken: string;

  // Create a virtual property for user_id derived from _id
  //FOR CUSTOM '_id'
  get user_id(): string {
    return this._id.toString();
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
