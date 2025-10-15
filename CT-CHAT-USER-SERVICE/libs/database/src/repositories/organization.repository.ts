import { OrgEntity } from '@database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class OrganizationRepository extends Repository<OrgEntity> {
  constructor(
    @InjectRepository(OrgEntity)
    private organizationRepository: Repository<OrgEntity>,
  ) {
    super(
      organizationRepository.target,
      organizationRepository.manager,
      organizationRepository.queryRunner,
    );
  }

  async createOrg(input: object): Promise<OrgEntity> {
    let org = await this.organizationRepository.create(input);
    org = await this.organizationRepository.save(org);

    return org;
  }

  async findOrg(orgId): Promise<OrgEntity> {
    return await this.organizationRepository.findOne({
      select: {
        org_name: true,
        email: true,
        logo: true,
      },
      where: {
        org_id: orgId,
      },
    });
  }

  async checkOrg(email): Promise<OrgEntity> {
    return await this.organizationRepository.findOne({
      select: {
        email: true,
      },
      where: {
        email: email,
      },
    });
  }
}
