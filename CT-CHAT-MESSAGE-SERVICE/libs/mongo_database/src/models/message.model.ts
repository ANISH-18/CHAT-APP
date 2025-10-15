import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

enum MessageStatus {
  Sent = 1,
  Viewed = 2,
}

export type MessageDocument = HydratedDocument<Message>;
@Schema({
  autoIndex: true,
  timestamps: true,
})
export class Message {
  @Prop({
    type: String,
    ref: 'Conversations',
    required: true,
  })
  conversation_id: string;

  @Prop({ type: String, required: true })
  uniqueId: string;

  @Prop({ type: String, ref: 'Users', required: true })
  sender_id: string;

  @Prop({ type: String, ref: 'Users', required: true })
  receiver_id: string;

  @Prop({
    required: true,
    type: {
      encrypted: String,
      nonce: String,
    },
  })
  content: {
    encrypted: string;
    nonce: string;
  };

  @Prop({ required: false, type: String })
  content_copy: string;

  @Prop({
    enum: MessageStatus,
    default: MessageStatus.Sent, // Default status is "sent"
  })
  status: number;

  @Prop({ default: Date.now })
  timestamp: Date;
  createdAt: string | number | Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
