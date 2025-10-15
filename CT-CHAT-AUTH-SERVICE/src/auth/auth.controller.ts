import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpUserDto } from './dto/signup-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import {
  ClientProxy,
  EventPattern,
  MessagePattern,
} from '@nestjs/microservices';
import {
  AccessTokenGuard,
  GetCurrentUser,
  GetCurrentUserId,
  RefreshTokenGuard,
} from '@jwt_auth';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserRegisteredEvent } from '@events';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @EventPattern('user.registered')
  handleUserRegisteredEvent(event: UserRegisteredEvent) {
    // const { user } = event;
    this.authService.handleUserRegisteredEvent(event);
  }

  @Post('syncuser')
  syncUser(@Body() input: SignUpUserDto) {
    return this.authService.syncUser(input);
  }

  @Post('signin')
  signIn(@Body() input: SignInUserDto) {
    return this.authService.signIn(input);
  }

  @UseGuards(AccessTokenGuard)
  @Get('signout')
  signOut(@GetCurrentUserId() userId) {
    return this.authService.signOut(userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refreshtoken')
  refreshToken(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshToken(userId, refreshToken);
  }

  @Get('forgot-password/:email')
  forgetPassword(@Param('email') email: string) {
    return this.authService.forgetPassword(email);
  }

  @Post('reset-password')
  resetPassword(@Body() input: ResetPasswordDto) {
    return this.authService.resetPassword(input);
  }

  @Post('register/FcmToken')
  async registerFcmToekn(@Body() data: any){
    return await this.authService.registerFcmToken(data)
  }

  @Get('getTokens')
  async getFcmTokens(@Query() data: any){
    return await this.authService.getFcmTokens(data);
  }

  @Put('updateFcm')
  async updateFcmToken(@Body() data: any){
    return await this.authService.updateFcmTokens(data);
  }


  @Put('deleteFcm')
  async deleteFcmToken(@Body() data: any){
    return await this.authService.deleteFcmTokens(data);
  }
}
