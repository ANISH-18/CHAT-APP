import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type MessageDocument = HydratedDocument<MessageRef>;

@Schema({
  autoIndex: true,
  timestamps: true,
})
export class MessageRef {
  @Prop({
    type: String,
    required: true,
  })
  messageId: string;

  @Prop({
    type: String,
    required: true,
  })
  fcmNotificationId: string;

  @Prop({
    type: String,
    required: false,
  })
  content: string;

  @Prop({
    type: String,
    required: true,
  })
  notifcationId: string;
}

export const MessageRefSchema = SchemaFactory.createForClass(MessageRef);
