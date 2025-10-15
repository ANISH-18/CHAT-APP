import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from '@mail';
import { HelpersModule } from '@helpers';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { DatabaseModule } from '@database';
import { JwtAuthModule } from '@jwt_auth';
import { PublicController } from './public/public.controller';
import { PublicService } from './public/public.service';
import {
  OrganzationController,
  PublicOrgController,
} from './organzation/organzation.controller';
import { OrganzationService } from './organzation/organzation.service';

import { RabbitMQModule } from 'libs/rabbitmq/src';
import { RolesController } from './roles/roles.controller';
import { RolesService } from './roles/roles.service';
import { ImportsModuleController } from './imports-module/imports-module.controller';
import { ImportsModuleService } from './imports-module/imports-module.service';
import { ImportsModuleHelper } from './imports-module/imports-module.helper';
import { PermissionController } from './permission/permission.controller';
import { PermissionService } from './permission/permission.service';
import { UserRoleController } from './user-role/user-role.controller';
import { UserRoleService } from './user-role/user-role.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { ProbizcaUserService } from './user-role/probizcaUser-Role.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    RabbitMQModule,
    DatabaseModule,
    MailModule,
    HelpersModule,
    JwtAuthModule,
  ],
  controllers: [
    AppController,
    AuthController,
    PublicController,
    OrganzationController,
    PublicOrgController,
    RolesController,
    ImportsModuleController,
    PermissionController,
    UserRoleController,
    UserController,
  ],
  providers: [
    AuthService,
    PublicService,
    OrganzationService,
    RolesService,
    ImportsModuleService,
    ImportsModuleHelper,
    PermissionService,
    UserRoleService,
    UserService,
    ProbizcaUserService,
  ],
})
export class AppModule {}
