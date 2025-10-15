import { UserEntity } from '@database';

export class UserRegisteredEvent {
  constructor(public readonly user: UserEntity) {}
}
