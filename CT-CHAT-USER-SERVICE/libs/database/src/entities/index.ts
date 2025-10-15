import { UserEntity } from './user.entity';
import { OrgEntity } from './organization.entity';
import { PermissionEntity } from './permission.entity';
import { RoleEntity } from './role.entity';
import { UserRoleEntity } from './userRole.entity';

export const entities = [
  UserEntity,
  OrgEntity,
  PermissionEntity,
  RoleEntity,
  UserRoleEntity,
];

export * from './user.entity';
export * from './organization.entity';
export * from './permission.entity';
export * from './role.entity';
export * from './userRole.entity';
