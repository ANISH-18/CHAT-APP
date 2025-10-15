import { UserRepository } from './user.repository';
import { OrganizationRepository } from './organization.repository';
import { RolesRepository } from './roles.repository';
import { PermissionRepository } from './permission.repository';
import { UserRoleRepository } from './userRole.repository';
import { from } from 'rxjs';
export const repositories = [
  UserRepository,
  OrganizationRepository,
  RolesRepository,
  PermissionRepository,
  UserRoleRepository,
];

export * from './user.repository';
export * from './organization.repository';
export * from './roles.repository';
export * from './permission.repository';
export * from './userRole.repository';
