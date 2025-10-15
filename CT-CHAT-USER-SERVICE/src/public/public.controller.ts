import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { PublicService } from './public.service';
import { SignupUserDto } from './dto/signup-user.dto';
import { AccessTokenGuard, GetCurrentUser, GetCurrentUserId } from '@jwt_auth';
import { ApiCreatedResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import { UserEntity } from '@database';

@ApiTags('Public')
@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @ApiProperty({
    type: SignupUserDto,
    description: 'Sign Up User',
  })
  @Post('signup')
  @ApiCreatedResponse({
    description: 'Sign Up User',
  })
  signUp(@Body() input: SignupUserDto) {
    return this.publicService.signUp(input);
  }

  @ApiProperty({
    description:
      'Token Check: to check whetheir the token is valid or not and extract user details',
  })
  @UseGuards(AccessTokenGuard)
  @Get('tokencheck')
  tokenCheck(
    @GetCurrentUserId() user_id: string,
    @GetCurrentUser() user: object,
  ) {
    return this.publicService.tokenCHeck(user_id, user);
  }
}
