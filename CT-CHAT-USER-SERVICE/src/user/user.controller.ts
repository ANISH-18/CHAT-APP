import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { AccessTokenGuard, ApiKeyGuard } from '@jwt_auth';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UpdateProfilePicDto } from './dto/profile-image.dto';
import { UserProfileDto } from './dto/user-profile.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(ApiKeyGuard)
  @Put('update')
  updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(updateUserDto);
  }

  @UseGuards(ApiKeyGuard)
  @Delete('delete')
  async deleteUser(@Query() deleteUserDto: DeleteUserDto) {
    return await this.userService.deleteUser(deleteUserDto);
  }

  @UseGuards(ApiKeyGuard)
  @Put('updateProfilePic')
  async updateProfilePic(@Body() updateProfilePicDto: UpdateProfilePicDto) {
    return this.userService.updateProfilePic(updateProfilePicDto);
  }

  //fetch user profile
  @UseGuards(AccessTokenGuard)
  @Get('profile')
  async userProfile(@Query() userProfileDto: UserProfileDto) {
    return this.userService.userProfile(userProfileDto);
  }
}
