import { UserRoleEntity } from '@database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';

export class UserRoleRepository extends Repository<UserRoleEntity> {
  constructor(
    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepository: Repository<UserRoleEntity>,
  ) {
    super(
      userRoleRepository.target,
      userRoleRepository.manager,
      userRoleRepository.queryRunner,
    );
  }

  async createUserRole(user_id, role, org_id) {
    const saveUserRole = this.userRoleRepository.create({
      user_id: user_id,
      role: role,
      org_id: org_id,
    });
    return await this.userRoleRepository.save(saveUserRole);
  }

  async checkUserRole(userId: string) {
    return await this.userRoleRepository.findOne({
      select: ['userRoleId', 'role'],
      where: {
        user_id: Equal(userId),
      },
    });
    // return await this.userRoleRepository
    //   .createQueryBuilder('userRoles')
    //   .leftJoinAndSelect('userRoles.role', 'role')
    //   .leftJoinAndSelect('userRoles.user', 'user')
    //   .where('userRoles.user_id = :user_id', { user_id: userId })
    //   .getMany();
  }

  async findUser(userId: string) {
    // return await this.userRoleRepository.findOne({
    //   select: ['userRoleId', 'user_id', 'org_id', 'role'],
    //   where: {
    //     user_id: Equal(userId),
    //   },
    //   relations: ['user_id', 'org_id'],
    // });

    return await this.userRoleRepository
      .createQueryBuilder('userRoles')
      .select([
        'userRoles.userRoleId',
        'user_id.user_id',
        'user_id.firstName',
        'user_id.lastName',
        'user_id.email',
        'userRoles.org_id',
        'role.role_id',
        'role.role_name',
      ])
      .where('userRoles.user_id = :user_id', { user_id: userId })
      .leftJoin('userRoles.user_id', 'user_id')
      .leftJoin('userRoles.role', 'role')
      .getMany();
  }

  async getAllUsers(org_id: number) {
    // Query Builder
    return await this.userRoleRepository
      .createQueryBuilder('userRoles')
      .select([
        'userRoles.userRoleId',
        'userRoles.role',
        'userRoles.user_id',
        'user_id.user_id',
        'user_id.email',
        'role.role_id',
        'role.role_name',
      ])
      .where('userRoles.org_id = :org_id', { org_id })
      .leftJoin('userRoles.user_id', 'user_id')
      .leftJoin('userRoles.role', 'role')
      .getMany();

    //Query to Group By
    //   return await this.userRoleRepository
    //     .createQueryBuilder('userRoles')
    //     .select([
    //       'userRoles.userRoleId',
    //       'userRoles.role', // Assuming 'role' is a property in UserRoleEntity referring to RoleEntity
    //       'userRoles.user_id',
    //       'user_id.user_id',
    //       'user_id.email',
    //       'role.role_id', // Include properties from RoleEntity
    //       'role.role_name', // Add more properties as needed
    //       'COUNT(userRoles.userRoleId) AS count', // Add count in the select clause
    //     ])
    //     .where('userRoles.org_id = :org_id', { org_id })
    //     .leftJoin('userRoles.user_id', 'user_id')
    //     .leftJoin('userRoles.role', 'role') // Add left join with 'role' relation
    //     .groupBy(
    //       [
    //         'userRoles.userRoleId',
    //         'userRoles.role',
    //         'userRoles.user_id',
    //         'user_id.user_id',
    //         'user_id.email',
    //         'role.role_id',
    //         'role.role_name',
    //       ].join(', '),
    //     ) // Add group by clause for correct counting
    //     .getRawMany();
  }

  async getRoleUsers(
    offset: number,
    recordsPerPage: number,
    showAll: string,
    role_id: number,
  ) {
    let query = await this.userRoleRepository
      .createQueryBuilder('userRoles')
      .select([
        'userRoles.userRoleId',
        'userRoles.role',
        'userRoles.user_id',
        'user_id.user_id',
        'user_id.firstName',
        'user_id.lastName',
        'role.role_id',
        'role.role_name',
      ])
      .where('userRoles.role = :role_id', { role_id })
      .leftJoin('userRoles.user_id', 'user_id')
      .leftJoin('userRoles.role', 'role');

    if (showAll !== 'true') {
      query = query.skip(offset).take(recordsPerPage);
    }

    return await query.getMany();

    // const count = await this.userRoleRepository
    //   .createQueryBuilder('userRoles')
    //   .where('userRoles.role = :role_id', { role_id })
    //   .getCount();

    // return {
    //   data: {
    //     users,
    //     count,
    //   },
    // };
  }

  async getUserRoleCount(role_id: number) {
    return await this.userRoleRepository.count({
      where: { role: Equal(role_id) },
    });
  }
}
