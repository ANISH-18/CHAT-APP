import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrganzationDto } from './dto/create-organzation.dto';
import { UpdateOrganzationDto } from './dto/update-organzation.dto';
import { OrganizationRepository } from '@database/repositories/organization.repository';

@Injectable()
export class OrganzationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async create(createOrganzationDto: CreateOrganzationDto) {
    try {
      Logger.log('createOrganzationDto', JSON.stringify(createOrganzationDto));

      const checkOrg = await this.organizationRepository.checkOrg(
        createOrganzationDto.email,
      );

      if (checkOrg) {
        throw new ConflictException('Organization already exists');
      }

      const createOrg = await this.organizationRepository.createOrg(
        createOrganzationDto,
      );

      return {
        data: createOrg,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getOrganizations(orgId: String) {
    try {
      Logger.log('orgId', orgId);
      const findOrg: object = await this.organizationRepository.findOrg(orgId);

      if (!findOrg) {
        throw new NotFoundException('Organization Not Found');
      }

      Logger.log(findOrg, 'findOrg');
      return {
        message: "Organization Fetched Successfully...'",
        data: findOrg,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
