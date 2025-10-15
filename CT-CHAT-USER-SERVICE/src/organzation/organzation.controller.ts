import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrganzationService } from './organzation.service';
import { CreateOrganzationDto } from './dto/create-organzation.dto';
import { UpdateOrganzationDto } from './dto/update-organzation.dto';
import { AccessTokenGuard } from '@jwt_auth';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Organization')
@Controller('organization')
export class OrganzationController {
  constructor(private readonly organzationService: OrganzationService) {}

  @ApiOperation({ summary: 'Get Organization API' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 201,
    description: 'Get Organization API',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Organization not found',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Internal Server Error',
  })
  // @UseGuards(AccessTokenGuard)
  @Get('getOrg')
  getOrganizations(@Query('orgId') orgId: String) {
    return this.organzationService.getOrganizations(orgId);
  }
}

@ApiTags('Public Route Organization')
@Controller('organization/public')
export class PublicOrgController {
  constructor(private readonly organizationService: OrganzationService) {}

  @ApiOperation({ summary: 'Register New Organization' })
  @ApiResponse({
    status: 201,
    description: 'Organization successfully registered',
  })
  @ApiConflictResponse({
    status: 409,
    description: 'Organization already exists',
  })
  @ApiBadRequestResponse({ description: 'Internal Server Error' })
  @Post('register')
  registerOrganization(@Body() createOrganzationDto: CreateOrganzationDto) {
    return this.organizationService.create(createOrganzationDto);
  }
}
