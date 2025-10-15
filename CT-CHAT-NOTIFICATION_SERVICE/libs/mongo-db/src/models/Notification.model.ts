import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

enum NotificationType {
  EMAIL = 1,
  SMS = 2,
  PUSH_NOTFICATION = 3,
}

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({
  autoIndex: true,
  timestamps: true,
})
export class Notification {
  @Prop({
    type: String,
    required: true,
  })
  authorId: string;

  @Prop({
    type: String,
    required: true,
  })
  authorFirstName: string;

  @Prop({
    type: String,
    required: true,
  })
  authorLastName: string;

  @Prop({
    type: String,
    required: true,
  })
  authorEmail: string;

  @Prop({
    type: String,
    required: false,
  })
  authorProfilePic: string;

  @Prop({
    type: Number,
    required: false,
  })
  authorRole: number;

  @Prop({
    type: String,
    required: true,
  })
  recipentId: string;

  @Prop({
    type: String,
    required: true,
  })
  recipentFirstName: string;

  @Prop({
    type: String,
    required: true,
  })
  recipentLastName: string;

  @Prop({
    type: String,
    required: true,
  })
  recipentEmail: string;

  @Prop({
    type: String,
    required: false,
  })
  recipentProfilePic: string;

  @Prop({
    type: Number,
    required: false,
  })
  recipentRole: number;

  @Prop({
    enum: NotificationType,
    required: true,
  })
  type: number;

  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  count: number;

  @Prop({
    type: String,
    required: false,
  })
  content: string;

  @Prop({
    type: String,
    required: false,
  })
  conversationId: string;

  @Prop({
    type: Date,
    required: true,
  })
  sentAt: Date;

  @Prop({
    type: Date,
    required: false,
  })
  readAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
