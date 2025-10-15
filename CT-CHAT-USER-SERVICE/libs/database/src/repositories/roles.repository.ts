import { RoleEntity } from '@database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';

export class RolesRepository extends Repository<RoleEntity> {
  constructor(
    @InjectRepository(RoleEntity)
    private rolesRepository: Repository<RoleEntity>,
  ) {
    super(
      rolesRepository.target,
      rolesRepository.manager,
      rolesRepository.queryRunner,
    );
  }

  async createRoles({
    orgId,
    createdBy,
    parent_id,
    role_name,
  }): Promise<RoleEntity> {
    let roles = await this.rolesRepository.create({
      org_id: orgId,
      createdBy,
      parent_id,
      role_name,
    });
    roles = await this.rolesRepository.save(roles);
    return roles;
  }

  async getRoles(org: number) {
    return await this.rolesRepository.find({
      select: ['role_id', 'role_name', 'org_id'],
      where: {
        org_id: Equal(org), // Correct usage: Assuming org_id is a field in your entity
        // org_id: org_id,
      },
      // relations: ['org'],
    });
    // return await this.rolesRepository;
    //     .createQueryBuilder('roles')
    //     // .select(['role_id', 'role_name', 'org_id'])
    //     .where('org_id = :org_id', { org_id: Number(org_id) })
    //     .getMany();
    // }
    // return await this.rolesRepository.find({
    //   select: {
    //     org_id: true,
    //     role_id: true,
    //     role_name: true,
    //   },
    // });
    // return await this.rolesRepository
    //   .createQueryBuilder('roles')
    //   .leftJoinAndSelect('roles.org', 'organization')
    //   .select(['roles.role_id', 'roles.role_name', 'roles.org'])
    //   .where('roles.org = :org', { org_id })
    //   .getMany();
  }
}
