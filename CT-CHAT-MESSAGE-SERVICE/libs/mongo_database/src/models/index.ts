import { ModelDefinition } from '@nestjs/mongoose';
import { User, UserSchema } from './user.model';
import { Conversation, ConversationSchema } from './conversation.model';
import { Message, MessageSchema } from './message.model';
import { Socket_User, Socket_UserSchema } from './socket-user.model';

export const models: ModelDefinition[] = [
  { name: User.name, schema: UserSchema },
  { name: Conversation.name, schema: ConversationSchema },
  { name: Message.name, schema: MessageSchema },
  {name: Socket_User.name, schema: Socket_UserSchema }
];

export * from './user.model';
export * from './conversation.model';
export * from './message.model';
export * from './socket-user.model';
