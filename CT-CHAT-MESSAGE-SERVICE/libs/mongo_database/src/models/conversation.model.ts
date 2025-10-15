import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

enum ConversationType {
  OneToOne = 1,
  Group = 2,
}

export type ConversationDocument = HydratedDocument<Conversation>;
@Schema({
  autoIndex: true,
  timestamps: true,
})
export class Conversation {
  @Prop({ required: true, enum: ConversationType })
  type: ConversationType;

  @Prop({ default: null })
  name?: string;

  @Prop({
    type: [{ type: String, ref: 'User' }],
    required: true,
    index: true,
  })
  participants: String[];

  @Prop({
    required: 'false',
    type: Number,
  })
  unSeenCount: number;

  @Prop({
    required: 'false',
    type: String,
  })
  lastUpdatedBy: String;

  @Prop({
    required: 'false',
    type: Date,
  })
  lastMessageAt: Date;

  //lastMessage
  @Prop({
    required: false,
    type: {
      encrypted: String,
      nonce: String,
    },
  })
  lastMessage: {
    encrypted: string;
    nonce: string;
  };

  @Prop({ required: false, type: String })
  lastMessage_copy: string;

  @Prop({
    required: 'false',
    type: [Number],
  })
  role: number[];

  @Prop({ required: true, type: String, ref: 'User' })
  createdBy: String;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
