import { ModelDefinition } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './Notification.model';
import { MessageRef, MessageRefSchema } from './MessageRef.model';

export const models: ModelDefinition[] = [
  { name: Notification.name, schema: NotificationSchema },
  { name: MessageRef.name, schema: MessageRefSchema },
];

export * from './Notification.model';

export * from './MessageRef.model';
