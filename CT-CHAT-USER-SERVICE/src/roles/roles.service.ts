import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateRolesDto } from './dto/create-roles.dto';
import { OrganizationRepository, RolesRepository } from '@database';

@Injectable()
export class RolesService {
  constructor(
    private readonly rolesRepository: RolesRepository,
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async createRoles(createRolesDto: CreateRolesDto) {
    try {
      const orgId: number = 1;
      const createdby: string = '23455';

      Logger.log(JSON.stringify(createRolesDto));

      for (const role_name of createRolesDto.role_name) {
        const newRole = await this.rolesRepository.createRoles({
          orgId: orgId,
          createdBy: createdby,
          parent_id: 1,
          role_name: role_name,
        });

        Logger.log('ROLE_NAME', newRole);
      }
      Logger.log('New Roles Added Lopp end');
      return {
        message: 'Roles Added Successfully...',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getRoles(org: number) {
    try {
      Logger.log(`org_id: ${JSON.stringify(org)}`, 'roles.service');

      const checkOrganization = await this.organizationRepository.findOrg(org);

      Logger.log('Organization', JSON.stringify(checkOrganization));

      if (!checkOrganization) {
        Logger.log('Organization Not Found', 'roles.service');

        throw new NotFoundException('Organization Not Found');
      }

      Logger.log('Before ROles Fetched', 'roles.service');
      const roles = await this.rolesRepository.getRoles(org);

      Logger.log('roles.service', JSON.stringify(roles));

      return {
        message: 'Roles Fetched Successfully...',
        data: roles,
      };
    } catch (error) {
      throw error;
    }
  }
}
