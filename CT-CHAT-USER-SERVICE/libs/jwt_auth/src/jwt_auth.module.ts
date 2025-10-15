import { Module } from '@nestjs/common';
import { JwtAuthService } from './jwt_auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { AccessTokenGuard } from './guards/access-token.guards';
import { RefreshTokenGuard } from './guards/refresh-token.guards';
import { DatabaseModule } from '@database';

@Module({
  imports: [
    JwtModule.register({}),
    DatabaseModule,
  ],
  providers: [
    JwtService, 
    JwtAuthService, 
    AccessTokenStrategy, 
    RefreshTokenStrategy, 
    AccessTokenGuard, 
    RefreshTokenGuard
  ],
  exports: [
    JwtService, 
    JwtAuthService,
    AccessTokenStrategy, 
    RefreshTokenStrategy, 
  ],
})
export class JwtAuthModule {}
