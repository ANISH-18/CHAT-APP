import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

import { AccessTokenGuard, GetCurrentUser, GetCurrentUserId } from '@jwt_auth';

import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { UserRegisteredEvent } from '@Events';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('AUTH')
@Controller('message')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //LISTENING TO USER SERVICE USER REGISTER
  @ApiProperty({ title: 'Register User' })
  @EventPattern('message.registered')
  handleRegisteredEvent(event: UserRegisteredEvent) {
    this.authService.handleRegisteredEvent(event);
  }

  // LISTENING TO USER SERVICE USER REGISTER
  // @EventPattern('user.registered')
  // message() {}

  //TOKEN CHECK ROUTE
  @ApiProperty({ title: 'Token Check' })
  @UseGuards(AccessTokenGuard)
  @Get('tokencheck')
  tokenCheck(
    @GetCurrentUserId() user_id: string,
    @GetCurrentUser() user: object,
  ) {
    return this.authService.tokenCHeck(user_id, user);
  }

  @EventPattern('message.user-update')
  async updateUser(event: any) {
    this.authService.updateUser(event);
  }

  @EventPattern('message.user-delete')
  async deleteUser(event: any) {
    this.authService.deleteUser(event);
  }

  @EventPattern('message.user-profilePic-update')
  async updateUserProfilePic(event: any) {
    this.authService.updateUserProfilePic(event);
  }


  @EventPattern('disable.parent.chat')
  disableChat(event: any){
    this.authService.disableChat(event);
  }
}
