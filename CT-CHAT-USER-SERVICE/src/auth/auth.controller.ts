import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpUserDto } from './dto/signup-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import {
  AccessTokenGuard,
  GetCurrentUser,
  GetCurrentUserId,
  RefreshTokenGuard,
} from '@jwt_auth';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiProperty({
    type: SignUpUserDto,
    description: 'Sign Up User',
  })
  @Post('signup')
  signUp(@Body() input: SignUpUserDto) {
    return this.authService.signUp(input);
  }

  @ApiProperty({
    type: SignInUserDto,
    description: 'Sign In User',
  })
  @Post('signin')
  signIn(@Body() input: SignInUserDto) {
    return this.authService.signIn(input);
  }

  @ApiProperty({
    description: 'Sign Out User',
  })
  @UseGuards(AccessTokenGuard)
  @Get('signout')
  signOut(@GetCurrentUserId() userId) {
    return this.authService.signOut(userId);
  }

  @ApiProperty({
    // name: 'refreshToken',
    description: 'Refresh Token',
  })
  @UseGuards(RefreshTokenGuard)
  @Get('refreshtoken')
  refreshToken(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshToken(userId, refreshToken);
  }

  @ApiProperty({
    description: 'Forget Password',
  })
  @Get('forgot-password/:email')
  forgetPassword(@Param('email') email: string) {
    return this.authService.forgetPassword(email);
  }

  @ApiProperty({
    type: ResetPasswordDto,
    description: 'Reset Password',
  })
  @Post('reset-password')
  resetPassword(@Body() input: ResetPasswordDto) {
    return this.authService.resetPassword(input);
  }
}
