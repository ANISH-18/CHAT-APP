import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { CreateUserRoleDto } from './dto/create-userRole.dto';
import { CheckUserRoleDto } from './dto/check-userRole.dto';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetUsersRoleDto } from './dto/getUsers-Role.dto';
import { EventPattern } from '@nestjs/microservices';
import { AccessTokenGuard, GetCurrentUser } from '@jwt_auth';
import { GetProbizcaUser } from './dto/get-Probizca-user.dto';
import { ProbizcaUserService } from './probizcaUser-Role.service';
import { PROBIZCA_SCOPE } from '@helpers/constants';

@ApiTags('userRole')
@Controller('userRole')
export class UserRoleController {
  constructor(
    private readonly userRoleService: UserRoleService,
    private readonly probizcaUserService: ProbizcaUserService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create User Role',
  })
  @Post('createUserRole')
  createUserRole(@Body() createUserRolesDto: CreateUserRoleDto) {
    return this.userRoleService.createUserRole(createUserRolesDto);
  }

  //Check user ROle
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Check User Role',
  })
  @ApiAcceptedResponse({
    description: 'Check User Role Success',
  })
  @ApiBadRequestResponse({
    description: 'User Role Not Found',
  })
  @Get('checkRole')
  checkUserRole(@Query() checkUserRoleDto: CheckUserRoleDto) {
    return this.userRoleService.checkUserRole(checkUserRoleDto);
  }

  //Get User
  @Get('getUser')
  getUser(@Query('userId') userId: string) {
    return this.userRoleService.getUser(userId);
  }

  @Get('getAllUser')
  getAllUser(@Query('org_id') org_id: number) {
    return this.userRoleService.getAllUser(org_id);
  }

  @UseGuards(AccessTokenGuard)
  @Get('getUsers')
  async getRoleUsers(@Query() getUserRoleDto: GetUsersRoleDto, @GetCurrentUser() user: any) {
    return await this.userRoleService.getRoleUsers(getUserRoleDto, user);
  }

  @EventPattern('user.updateOnlineStatus')
  async handleUserOnlineStatus(event: any) {
    this.userRoleService.handleUserOnlineStatus(event);
  }

  // //Test route for probizca
  // @UseGuards(AccessTokenGuard)
  // @Get('cust')
  // async getCustomer(@Query() data: any, @GetCurrentUser() user: any) {
  //   // return this.userRoleService.getCustomer(data, user);
  //   return this.userRoleService.getBusiness(data, user);
  // }

  // @UseGuards(AccessTokenGuard)
  // // @Get('getProbizcaUsers')
  // async getProbizcaUsers(
  //   @Query() getProbizcaUser: GetProbizcaUser,
  //   @GetCurrentUser() user: any,
  // ) {
  //   Logger.log('User', user);
  //   return await this.userRoleService.getProbizcaUsers(getProbizcaUser, user);
  // }

  @UseGuards(AccessTokenGuard)
  @Get('getProbizcaUsers')
  async getProbizca(
    @Query() getProbizcaUser: GetProbizcaUser,
    @GetCurrentUser() user: any,
  ) {
    Logger.log('Correct Route');
    const handler = PROBIZCA_SCOPE[user.role];
    Logger.log('coreect handler');
    return await this.probizcaUserService[handler](getProbizcaUser, user);
  }
}
