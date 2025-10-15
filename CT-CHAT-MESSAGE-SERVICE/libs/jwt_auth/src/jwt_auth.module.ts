import { Module } from '@nestjs/common';
import { JwtAuthService } from './jwt_auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
  WsJWTStrategy,
} from './strategies';
import { AccessTokenGuard } from './guards/access-token.guards';
import { RefreshTokenGuard } from './guards/refresh-token.guards';

import { WsJwtGuard, WsTokenGuard } from './guards';
import { MongoDBModule } from '@MongoDB';

@Module({
  imports: [JwtModule.register({}), MongoDBModule],
  providers: [
    JwtService,
    JwtAuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    WsJWTStrategy,
    AccessTokenGuard,
    RefreshTokenGuard,
    WsTokenGuard,
    WsJwtGuard,
  ],
  exports: [
    JwtService,
    JwtAuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    WsJWTStrategy,
  ],
})
export class JwtAuthModule {}
