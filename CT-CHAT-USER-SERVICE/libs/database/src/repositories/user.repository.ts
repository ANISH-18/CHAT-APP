import { UserEntity } from '@database/entities';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Equal, Repository } from 'typeorm';

export class UserRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    super(
      userRepository.target,
      userRepository.manager,
      userRepository.queryRunner,
    );
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ email });
  }

  async findById(user_id: string): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ user_id });
  }

  async createUser(input: object): Promise<UserEntity> {
    let user = await this.userRepository.create(input);
    user = await this.userRepository.save(user);

    return user;
  }

  async getRoleUsers(
    currentUserId: string,
    offset: number,
    recordsPerPage: number,
    showAll: string,
    role: any,
    search?: string,
    parent_id?: string,
  ) {
    Logger.log('Current user ', currentUserId);
    let query = this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.user_id',
        'user.firstName',
        'user.lastName',
        'user.profilePic',
        'role.role_id',
        'role.role_name',
        'user.isOnline',
        'user.businessName',
      ])
      // .where('user.role = :role', { role })
      .where("user.role IN (:...role)", { role })
      .andWhere("user.user_id != :currentUserId", { currentUserId })
      .leftJoin('user.role', 'role');

      if (search) {
        query.andWhere(
          new Brackets(qb => {
            qb.where(
              `LOWER(CONCAT(user.firstName, ' ', user.lastName)) LIKE LOWER(:search)`,
              { search: `${search}%` },
            ).orWhere(
              `LOWER(user.lastName) LIKE LOWER(:search)`,
              { search: `${search}%` },
            );
          }),
        );
      }
    

    if(parent_id){
      query.andWhere('user.parent_id = :parent_id', { parent_id })
    }
    if (showAll !== 'true') {
      query = query.skip(offset).take(recordsPerPage);
    }
    return await query.getMany();
  }

  async getUserRoleCount(role: any, parent_id?: string, currentUserId?: string,search?: string) {
    const query = this.userRepository.createQueryBuilder("user")
      .where("user.role IN (:...role)", { role })
      .andWhere("user.user_id != :currentUserId", { currentUserId });

    if (search) {
      query.andWhere(
        new Brackets(qb => {
          qb.where(
            `LOWER(CONCAT(user.firstName, ' ', user.lastName)) LIKE LOWER(:search)`,
            { search: `${search}%` },
          ).orWhere(
            `LOWER(user.lastName) LIKE LOWER(:search)`,
            { search: `${search}%` },
          );
        }),
      );
    }

    if (parent_id !== undefined) {
      query.andWhere("user.parent_id = :parent_id", { parent_id });
    }
  
    return await query.getCount();
  }

  async deleteUser(parent_id: number, role: number, ref_userId: number) {
    return await this.userRepository
      .createQueryBuilder('user')
      .softDelete()
      .where('ref_userId = :ref_userId', { ref_userId })
      .andWhere('parent_id = :parent_id', { parent_id })
      .andWhere('role = :role', { role })
      .execute();
  }

  async handleUserOnlineStatus(user_id: string, status: number) {
    return await this.userRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set({ isOnline: status })
      .where('user_id = :user_id', { user_id })
      .execute();
  }

  async updateUser(user_id: string, data: any) {
    Logger.log('data ', JSON.stringify(data));
    return await this.createQueryBuilder()
      .update(UserEntity)
      .set(data)
      .where('user_id = :user_id', { user_id: user_id })
      .execute();
  }

  async findUserWithRef(data: any) {
    Logger.log('data', data);

    let query = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.user_id'])
      // .where('user.email = :email', { email: data.email })
      .where('user.role = :role', { role: data.role })
      .andWhere('user.ref_userId = :ref_userId', {
        ref_userId: data.ref_userId,
      });

    if (data.email) {
      query = query.andWhere('user.email = :email', { email: data.email });
    }
    // .andWhere('user.parent_id = :parent_id', { parent_id: data.parent_id })
    return await query.getOne();
  }

  async deleteUserWithID(user_id: string) {
    return await this.userRepository.softDelete({ user_id });
  }

  async updateProfilePic(user_id: string, profilePic: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .update(UserEntity)
      .set({ profilePic })
      .where('user_id = :user_id', { user_id })
      .execute();
  }

  async userProfile(user_id: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.user_id',
        'user.firstName',
        'user.lastName',
        'user.profilePic',
        'user.isOnline',
        'user.businessName',
        'user.phoneNumber',
        'user.email',
        'user.userData',
      ])
      .where('user.user_id = :user_id', { user_id })
      .getOne();
  }

  //GET CUSTOMER LOGIC FOR USERDATA JSON
  //Refactor: Remove unnecessary objects from the userData to reduce res payload size: Done
  async findCustomer(
    parent_id: number,
    role_id: string,
    offset: number,
    recordsPerPage: number,
    showAll: string,
    search?: string,
  ) {
    try {
      Logger.log('INSIDE CUS');
      let query = this.userRepository
        .createQueryBuilder('user')
        .select([
          'user.user_id',
          'user.firstName',
          'user.lastName',
          'user.profilePic',
          'user.isOnline',
          'user.businessName',
          'role.role_id',
          'role.role_name',
          'user.userData',
        ])
        .leftJoin('user.role', 'role')
        .where('user.role = :role_id', { role_id })
        .andWhere(
          `${parent_id} = ANY(
        SELECT (data ->> 'parent_id')::int
        FROM jsonb_array_elements("user"."userData") AS data
      )`,
        );

      // Logger.log('Query', JSON.stringify(query));

      // Applying search condition
      if (search) {
        query.andWhere(
          '(LOWER(user.firstName) LIKE LOWER(:search) OR LOWER(user.lastName) LIKE LOWER(:search))',
          { search: `%${search}%` },
        );
      }

      // Applying pagination
      if (showAll !== 'true') {
        query = query.skip(offset).take(recordsPerPage);
      }

      // Execute the query and return the result
      return await query.getMany();
    } catch (error) {
      throw error;
    }
  }

  //GET BUSINESS LOGIC FOR USERDATA JSON
  async findByBusiness(
    parent_id: number,
    offset: number,
    recordsPerPage: number,
    showAll: string,
    search?: string,
  ) {
    try {
      Logger.log(
        'offset',
        offset,
        'recordsPerPage',
        recordsPerPage,
        'parent_id',
        parent_id,
      );
      let query = this.createQueryBuilder('user')
        .select([
          'user.user_id',
          'user.firstName',
          'user.lastName',
          'user.profilePic',
          'user.isOnline',
          'user.businessName',
          'role.role_id',
          'role.role_name',
          'user.userData',
        ])
        .leftJoin('user.role', 'role')
        .where('user.parent_id = :parent_id', { parent_id: parent_id })
        .andWhere('user.role = :role', { role: 2 })
        .andWhere('user.deleted_at IS NULL');

      if (search) {
        query = query.andWhere(
          '(LOWER(user.firstName) LIKE LOWER(:search) OR LOWER(user.lastName) LIKE LOWER(:search))',
          { search: `%${search}%` },
        );
      }
      // Applying pagination
      // Applying pagination
      if (showAll !== 'true') {
        query = query.skip(offset).take(recordsPerPage);
      }

      // Execute the query and return the result
      return await query.getMany();
    } catch (error) {
      throw error;
    }
  }

  async getCustomerCount(parent_id: number) {
    try {
      const count = await this.userRepository
        .createQueryBuilder('user')
        .where(
          `${parent_id} = ANY(
        SELECT (data ->> 'parent_id')::int
        FROM jsonb_array_elements("user"."userData") AS data
      )`,
        )
        .getCount();

      return count;
    } catch (error) {
      throw error;
    }
  }
}
