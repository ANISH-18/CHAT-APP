import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserRoleDto } from './dto/create-userRole.dto';
import { PermissionRepository, UserData, UserRepository, UserRoleRepository } from '@database';
import { CheckUserRoleDto } from './dto/check-userRole.dto';
import { GetUsersRoleDto } from './dto/getUsers-Role.dto';
import { GetProbizcaUser } from './dto/get-Probizca-user.dto';
import { canChat } from '@helpers/constants';

@Injectable()
export class UserRoleService {
  constructor(
    private readonly userRoleRepository: UserRoleRepository,
    private readonly userRepository: UserRepository,
    private readonly permissionRepository: PermissionRepository
  ) {}

  async createUserRole(createUserRoleDto: CreateUserRoleDto) {
    try {
      const saveUserRole = await this.userRoleRepository.createUserRole(
        createUserRoleDto.user_id,
        createUserRoleDto.role,
        createUserRoleDto.org_id,
      );

      return {
        message: 'User Role Success',
        data: saveUserRole,
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  //Check User Role
  async checkUserRole(checkUserRoleDto: CheckUserRoleDto) {
    try {
      const { userId } = checkUserRoleDto;
      const checkUserRole = await this.userRoleRepository.checkUserRole(userId);

      if (!checkUserRole) {
        throw new NotFoundException('User Role Not Found');
      }
      return {
        message: 'User Role Success',
        data: checkUserRole,
      };
    } catch (error) {
      throw error;
    }
  }

  //Get USer
  async getUser(userId: string) {
    try {
      Logger.log('userId', userId);
      const user = await this.userRoleRepository.findUser(userId);

      Logger.log(`User ${user}`);

      return {
        message: 'User Role Success',
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }

  //Get All User in Org
  async getAllUser(org_id: number) {
    try {
      const getAllUser = await this.userRoleRepository.getAllUsers(org_id);
      const count = getAllUser.length;
      return {
        data: {
          count,
          users: getAllUser,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  //Get Role Wise User
  async getRoleUsers(getUserRoleDto: GetUsersRoleDto, user: any) {
    try {
      const { page, recordsPerPage, showAll, role_id, search, parent_id } = getUserRoleDto;
      // console.log('user', user);
      
      //if not role, then extrach user role from token and get eligble roles for that user role
      let roles = null;
      let eligibleRoleIds = null;
      if(!role_id){
        roles = await this.permissionRepository.findRoles(user.role, canChat.Yes);
         eligibleRoleIds = new Set(
          roles.filter(role => role.canchat === 1).map(role => role.roles_role_id)
        );
      }
      console.log("roles", roles);
      console.log('eligble', eligibleRoleIds);
      console.log("user", user)
      
      

      const offset = (page - 1) * recordsPerPage;

      Logger.log('offset', offset);

      const rolesToCheck = role_id ? [role_id] : Array.from(eligibleRoleIds || []);
      console.log('rolesTocheck', rolesToCheck);
      

      const [users, userCount] = await Promise.all([
        this.userRepository.getRoleUsers(
          user.sub,
          offset,
          recordsPerPage,
          showAll,
          rolesToCheck,
          search,
          parent_id,
       
        ),
        this.userRepository.getUserRoleCount(rolesToCheck, parent_id, user.sub,search),
      ]);

      const nextPageAvailable = page * recordsPerPage < userCount;
      const prevPageAvailable = page > 1;

      return {
        message: 'Users...',
        data: {
          count: users.length,
          totalCount: userCount,
          users: users,
          // nextPageAvailable,
          // prevPageAvailable,
        },
        meta: {
          nextPageAvailable,
          prevPageAvailable,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async handleUserOnlineStatus(event: any) {
    try {
      Logger.log(event);
      Logger.log(event.user_id, 'user_id');
      const { user_id, status } = event;
      const result = await this.userRepository.handleUserOnlineStatus(
        user_id,
        status,
      );
      Logger.log('exit', result);
    } catch (error) {
      throw error;
    }
  }

  //Switch Case to handle Probizca Custom Users
  //No Need After Dev testing complete remove
  async getProbizcaUsers(getProbizcaUser: GetProbizcaUser, user: any) {
    try {
      Logger.log('getUserRoleDto', JSON.stringify(getProbizcaUser));
      const { role_id } = getProbizcaUser;

      if (user.role == role_id) {
        throw new ConflictException('You Cannot Access Same Role');
      }

      Logger.log('User', user);
      //Role Wise Search Method Apply
      Logger.log('Role ID', role_id);
      const Role: number = parseInt(role_id, 10);

      switch (Role) {
        case 1:
          Logger.log('INSIDE SA');
          return await this.getSA(getProbizcaUser, user);
          break;
        case 2:
          Logger.log('INSIDE BO');
          return await this.getBusiness(getProbizcaUser, user);
          break;
        case 4:
          Logger.log('INSIDE CUSTOMER');
          return await this.getCustomer(getProbizcaUser, user);
          break;
        case 5:
          Logger.log('INSIDE AFfiliate');
          return await this.getCustomer(getProbizcaUser, user);
          break;
        default:
          Logger.log('No Role');
          break;
      }
      return {
        message: 'Users...',
      };
    } catch (error) {
      throw error;
    }
  }

  //Apply for customer and affiliate
  //To get all customer and affiliate which are registered for the user's businessId
  //No Need After Dev testing complete remove
  private async getCustomer(getProbizcaUser: GetProbizcaUser, user: any) {
    try {
      // Logger.log('User', user);
      const { page, recordsPerPage, showAll, role_id, search } =
        getProbizcaUser;
      const offset = (page - 1) * recordsPerPage;

      Logger.log('showALl', showAll);

      Logger.log('offset', offset);

      //Search User
      const checkUser = await this.userRepository.findById(user.sub);

      Logger.log('check user', JSON.stringify(checkUser));

      if (!checkUser) {
        throw new NotFoundException('User Not Found');
      }

      Logger.log('USER BUSSINESS ID ', checkUser.parent_id);

      const [getCustomer, getCustomerCount] = await Promise.all([
        await this.userRepository.findCustomer(
          checkUser.parent_id,
          role_id,
          offset,
          recordsPerPage,
          showAll,
          search,
        ),
        await this.userRepository.getCustomerCount(checkUser.parent_id),
      ]);

      // Logger.log('getCustomer', JSON.stringify(getCustomer));

      if (!getCustomer || getCustomer.length === 0) {
        throw new NotFoundException('Customer Not Found');
      }

      const nextPageAvailable = page * recordsPerPage < getCustomerCount;
      const prevPageAvailable = page > 1;

      return {
        data: {
          count: getCustomer.length,
          totalCount: getCustomerCount,
          users: getCustomer,
        },
        meta: {
          nextPageAvailable,
          prevPageAvailable,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  //Apply The getBusiness for Emp and Business
  //Method for CUST and Affiliate to get Specific B.O or Emp
  //No Need After Dev testing complete remove
  private async getBusiness(getProbizcaUser: GetProbizcaUser, user: any) {
    try {
      const { page, recordsPerPage, showAll, role_id, search } =
        getProbizcaUser;
      const offset = (page - 1) * recordsPerPage;

      Logger.log('offset', offset);
      //Get the current User
      const customer = await this.userRepository.findById(user.sub);

      Logger.log('USER ', JSON.stringify(customer.userData));
      const role = parseInt(role_id, 10);

      if (customer.userData === null) {
        const [users, userCount] = await Promise.all([
          this.userRepository.getRoleUsers(
            user.sub,
            offset,
            recordsPerPage,
            showAll,
            role,
            search,
          ),
          this.userRepository.getUserRoleCount(role),
        ]);

        const nextPageAvailable = page * recordsPerPage < userCount;
        const prevPageAvailable = page > 1;

        return {
          message: 'Users...',
          data: {
            count: users.length,
            totalCount: userCount,
            users: users,
            // nextPageAvailable,
            // prevPageAvailable,
          },
          meta: {
            nextPageAvailable,
            prevPageAvailable,
          },
        };
      }

      //Extract the userData from customer
      const userData = customer.userData as UserData[];

      //Extract the parent_id from userData
      const parentIds = userData.map((user) => user.parent_id);

      Logger.log('parent_ids', parentIds);

      //Search User from parentId
      const userPromises = parentIds.map(async (parentId) => {
        Logger.log('Hello');
        const user = await this.userRepository.findByBusiness(
          parentId,
          offset,
          recordsPerPage,
          showAll,
          search,
        );
        return user;
      });

      // Wait for all promises to resolve concurrently
      const resolvedUsers = await Promise.all(userPromises);

      // Filter out undefined values
      const users = resolvedUsers.filter(Boolean);

      // Flatten the array of arrays
      const flattenedUsers = [].concat(...users);
      // Logger.log('users', flattenedUsers);

      if (!flattenedUsers || flattenedUsers.length === 0) {
        throw new NotFoundException('Business Specific Users Not Found');
      }

      const nextPageAvailable = page * recordsPerPage < parentIds.length;
      const prevPageAvailable = page > 1;

      return {
        message: 'Business Specific Users....',
        data: {
          count: flattenedUsers.length,
          totalCount: parentIds.length,
          users: flattenedUsers,
        },
        meta: {
          nextPageAvailable,
          prevPageAvailable,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  //Get SA Users
  //To Fetch All Users with role's only
  //No Need After Dev testing complete remove
  private async getSA(getProbizcaUser: GetProbizcaUser, user: any) {
    try {
      const { page, recordsPerPage, showAll, role_id, search } =
        getProbizcaUser;

      const offset = (page - 1) * recordsPerPage;
      const Role: number = parseInt(role_id, 10);

      // Logger.log('offset', offset);

      const [users, userCount] = await Promise.all([
        this.userRepository.getRoleUsers(
          user.sub,
          offset,
          recordsPerPage,
          showAll,
          Role,
          search,
        ),
        this.userRepository.getUserRoleCount(Role),
      ]);

      const nextPageAvailable = page * recordsPerPage < userCount;
      const prevPageAvailable = page > 1;

      return {
        message: "Super Admin's...",
        data: {
          count: users.length,
          totalCount: userCount,
          users: users,
        },
        meta: {
          nextPageAvailable,
          prevPageAvailable,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
