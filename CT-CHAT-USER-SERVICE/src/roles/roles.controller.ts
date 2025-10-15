import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRolesDto } from './dto/create-roles.dto';
import { AccessTokenGuard } from '@jwt_auth';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  //Create Role for Organization
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create Roles',
  })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Internal Server Error',
  })
  // @UseGuards(AccessTokenGuard)
  @Post('create')
  createRoles(@Body() createRolesDto: CreateRolesDto) {
    return this.rolesService.createRoles(createRolesDto);
  }

  //Get Role for organization
  @ApiOperation({
    summary: 'Get Roles',
  })
  @ApiResponse({
    status: 201,
    description: 'Roles Fetched Successfully...',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Organization Not Found',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Internal Server Error',
  })
  @ApiQuery({
    name: 'org',
    type: Number,
    required: true,
    description: 'Organization Id',
  })
  @UseGuards(AccessTokenGuard)
  @Get('getRoles')
  getRoles(@Query('org', ParseIntPipe) org: number) {
    return this.rolesService.getRoles(org);
  }
}
