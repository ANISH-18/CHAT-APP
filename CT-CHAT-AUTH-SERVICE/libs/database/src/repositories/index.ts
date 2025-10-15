import { UserRepository } from './user.repository';
import { ClientRepository } from './client.repository';
import { AuthorizationRepository } from './authorization.repository';
import { AuthLogsRepository } from './authLogs.repository';
import { FcmTokenRepository } from './fcm-token.repository';

export const repositories = [
  UserRepository,
  ClientRepository,
  AuthorizationRepository,
  AuthLogsRepository,
  FcmTokenRepository,
];

export * from './user.repository';
export * from './client.repository';
export * from './authorization.repository';
export * from './authLogs.repository';
export * from './fcm-token.repository';