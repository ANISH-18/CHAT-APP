import { PermissionEntity } from '@database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';

export class PermissionRepository extends Repository<PermissionEntity> {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) {
    super(
      permissionRepository.target,
      permissionRepository.manager,
      permissionRepository.queryRunner,
    );
  }

  async createPermission(key, valueKey, value) {
    let savePermission = await this.permissionRepository.create({
      role_A: key,
      role_B: valueKey,
      canChat: value,
    });
    savePermission = await this.permissionRepository.save(savePermission);
    return savePermission;
  }

  async checkPermission(role_A: number, role_B: number): Promise<any> {
    return await this.permissionRepository.find({
      select: ['permission_id', 'role_A', 'role_B', 'canChat'],
      // where: [{ role_A: Equal(role_A) }, { role_B: Equal(role_B) }],
      where: { role_A: Equal(role_A), role_B: Equal(role_B) },
    });
    // return await this.permissionRepository
    //   .createQueryBuilder('permission')
    //   .select(['permission_id', 'role_A', 'role_B', 'canChat'])
    //   .where('role_A = :role_A', { role_A: role_A })
    //   .andWhere('role_B = :role_B', { role_B: role_B })
    //   .andWhere('"permission"."deleted_at" IS NULL')
    //   .getMany();
  }

  async findRoles(role_id: number, canChat: number) {
    // const canChat: number = 1;
    return await this.permissionRepository
      .createQueryBuilder('permission')
      .select([
        'MAX(permission.canChat) as canChat',
        'roles.role_id',
        'roles.role_name',
      ])
      .where('permission.role_A = :role_A', { role_A: role_id })
      .andWhere('permission.canChat = :canChat', { canChat })
      .andWhere('permission.deleted_at IS NULL')
      .leftJoin('permission.role_B', 'roles')
      .groupBy('roles.role_id')
      .having('COUNT(permission.role_B) > 0')
      .getRawMany();
  }
}
