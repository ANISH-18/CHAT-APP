import { UserEntity } from './user.entity';
import { ClientEntity } from './client.entity';
import { AuthorizationEntity } from './authorization.entity';
import { AuthLogsEntitiy } from './auth_logs.entity';
import { FCMTokenEntity } from './fcm_token.entity';

export const entities = [
  UserEntity,
  ClientEntity,
  AuthorizationEntity,
  AuthLogsEntitiy,
  FCMTokenEntity
];

export * from './user.entity';
export * from './client.entity';
export * from './authorization.entity';
export * from './auth_logs.entity';
export * from './fcm_token.entity';
