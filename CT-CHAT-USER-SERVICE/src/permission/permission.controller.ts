import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CheckPermissionDto } from './dto/check-permission.dto';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from '@jwt_auth';

@ApiTags('Permission')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiOperation({ summary: 'Set Permissions' })
  @ApiResponse({
    status: 201,
    description: "Permission's Added Successfully",
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Internal Server Error',
  })
  // @UseGuards(AccessTokenGuard)
  @Post('setPermissions')
  createPermissions(@Body() body: object) {
    return this.permissionService.createPermissions(body);
  }

  @ApiOperation({ summary: 'Check Permissions' })
  @ApiAcceptedResponse({
    status: 201,
    description: 'Success Chat With the User',
  })
  @ApiNotAcceptableResponse({
    status: 406,
    description: 'Cannot Chat With the User',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Permission Not Found',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Internal Server Error',
  })
  @ApiQuery({
    name: 'role_A',
  })
  @ApiQuery({
    name: 'role_B',
  })
  @ApiQuery({
    name: 'org_id',
  })
  @Get('checkPermission')
  checkPermission(@Query() checkPermissionDto: CheckPermissionDto) {
    return this.permissionService.checkPermission(checkPermissionDto);
  }

  @Get('checkRole')
  @UseGuards(AccessTokenGuard)
  getRoles(@Query('role_id') role_id: number) {
    return this.permissionService.getRoles(role_id);
  }
}
