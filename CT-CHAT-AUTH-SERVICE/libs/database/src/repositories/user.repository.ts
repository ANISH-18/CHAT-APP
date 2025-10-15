import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@database/entities';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
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
    Logger.log('Inside User Repo', email);
    return await this.userRepository.findOneBy({ email });
  }

  async findById(user_id: string): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ user_id });
  }

  async findByUserId(user_id: string) {
    console.log("userid", user_id);  // Log the user_id to confirm it's correct
    const user = await this.userRepository.findOne({
      where: {
        user_id: user_id // Just pass the actual user_id, not an object
      }
    });
    return user;

  }

  async saveUser(input: object): Promise<UserEntity> {
    let user = await this.userRepository.create(input);
    user = await this.userRepository.save(user);
    return user;
  }

  async getValidUser(email: string, role: number, parent_id: number){
    try {
      Logger.log("Querying Valid User For authentication")
      return await this.userRepository.createQueryBuilder('user')
      .where('email = :email', { email })
      .andWhere('parent_id = :parent_id', { parent_id })
      .andWhere('role = :role', { role })
      .getOne();
      
    } catch (error) {
      Logger.error("Error While Getting Valid User for authentication in userRepository", error.message)
      throw error;
    }
  }

  async findProbizcaUser(
    email: string,
    parent_id: number,
    role: number,
  ): Promise<UserEntity> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('email = :email', { email })
      .andWhere('parent_id = :parent_id', { parent_id })
      .andWhere('role = :role', { role })
      .getOne();
  }

  async findProbizcaCustomer(email: string, role: number): Promise<UserEntity> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .andWhere('user.role = :role', { role })
      .getOne();
  }

  async updateUser(user_id: string, data: object) {
    return await this.createQueryBuilder()
      .update(UserEntity)
      .set(data)
      .where('user_id = :user_id', { user_id: user_id })
      .execute();
  }

  async deleteUser(user_id: string): Promise<void> {
    await this.userRepository.softDelete({ user_id });
  }

  async updateUserProfilePic(user_id: string, profilePic: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .update(UserEntity)
      .set({ profilePic })
      .where('user_id = :user_id', { user_id })
      .execute();
  }


  async chatEnabled(data: {parent_id: number, chatEnabled: boolean}){
    try {
      return await this.userRepository.update(
        {parent_id: data.parent_id},
        { chatEnabled: data.chatEnabled }
      )
    } catch (error) {
      Logger.error("Failed to enable/disable")
      throw error;
    }
  }

  async checkChatStatus(){

  }


  async getUserIds(parent_id: number){
    try {
      console.log('parentinrepo', parent_id);
      
      return await this.userRepository.find(
        {
          where: {parent_id: parent_id},
          select: ['user_id']
        }
      )
      
    } catch (error) {
      Logger.error("failed to get userIds from parent_id")
      throw error;
    }
  }

  async verifyChatEnable(user_id: string){
    try {
      return await this.userRepository.findOne({
        where: { user_id: user_id },
        select: ['chatEnabled'] 
      });

    } catch (error) {
      Logger.error("Error while fetching Verification of chat enable")
      throw error;
    }
  }
}
