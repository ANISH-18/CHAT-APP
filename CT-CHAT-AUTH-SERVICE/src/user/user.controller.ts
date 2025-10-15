import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @EventPattern('auth.user-update')
  async updateUser(event: any) {
    this.userService.updateUser(event);
  }

  @EventPattern('auth.user-delete')
  async deleteUser(event: any) {
    this.userService.deleteUser(event);
  }

  @EventPattern('auth.user-profilePic-update')
  async updateUserProfilePic(event: any) {
    this.userService.updateUserProfilePic(event);
  }
}
