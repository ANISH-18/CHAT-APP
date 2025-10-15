import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { GetProbizcaUser } from './dto/get-Probizca-user.dto';
import { UserData, UserRepository } from '@database';

@Injectable()
export class ProbizcaUserService {
  constructor(private readonly userRepository: UserRepository) {}

  //Handle Probizca Admin Logic
  //Done tested
  async probizcaAdmin(getProbizcaUser: GetProbizcaUser, user: any) {
    try {
      Logger.log(user, 'user');
      const { role_id } = getProbizcaUser;
      Logger.log('Inside probizcaAdmin');
      if (user.role == role_id) {
        throw new ConflictException('You Cannot Access Same Role');
      }
      Logger.log('Before');
      const Role: number = parseInt(role_id, 10);

      switch (Role) {
        case 1:
          Logger.log('Same Role');
          throw new ConflictException('You Cannot Access Same Role');

        case 2:
          Logger.log('BO');
          return await this.getNormal(getProbizcaUser, user);

        //Method To Retrieve BO

        case 5:
          Logger.log('Affiliate');
          return await this.getNormal(getProbizcaUser, user);

        //Method To Retrieve all Affiliate

        default:
          Logger.log('No Role');
          return {
            message: 'Inside Admin',
          };
      }
    } catch (error) {
      throw error;
    }
  }

  //Done Tested
  async probizcaBO(getProbizcaUser: GetProbizcaUser, user: any) {
    try {
      Logger.log('probizcaBO');
      const { role_id } = getProbizcaUser;

      // if (user.role == role_id) {
      //   throw new ConflictException('You Cannot Access Same Role');
      // }
      const Role: number = parseInt(role_id, 10);

      switch (Role) {
        case 1:
          //Retrive All SA
          return await this.getNormal(getProbizcaUser, user);

        case 2:
          Logger.log('Same Role');
          throw new ConflictException('You Cannot Access Same Role');

        case 3:

        case 4:
          Logger.log('CUST');
          //Method to retrieve all Cust
          return await this.getCustomer(getProbizcaUser, user);

        case 5:
          Logger.log('Affiliate');
          //Method to retrieve all Affiliate
          return await this.getCustomer(getProbizcaUser, user);

        default:
          Logger.log('No Role');
          break;
      }

      return {
        message: 'Inside BO',
      };
    } catch (error) {
      throw error;
    }
  }

  //No Requirement for now
  async probizcaEmp(getProbizcaUser: GetProbizcaUser, user: any) {
    try {
      return {
        message: 'Inside EM',
      };
    } catch (error) {
      throw error;
    }
  }

  //Done Tested
  async probizcaCust(getProbizcaUser: GetProbizcaUser, user: any) {
    try {
      const { role_id } = getProbizcaUser;
      if (user.role == role_id) {
        throw new ConflictException('You Cannot Access Same Role');
      }
      const Role: number = parseInt(role_id, 10);

      switch (Role) {
        case 1:
        //No Access to SA

        case 2:
          //Get registered BO only
          return await this.getBusiness(getProbizcaUser, user);

        case 4:
          //Retrieve BO All
          Logger.log('Same Role');
          throw new ConflictException('You Cannot Access Same Role');

        default:
          Logger.log('No Role');
          break;
      }
      return {
        message: 'Inside CUST',
      };
    } catch (error) {
      throw error;
    }
  }

  //Plans .
  async probizcaAff(getProbizcaUser: GetProbizcaUser, user: any) {
    try {
      Logger.log('probizcaAFF');
      const { role_id } = getProbizcaUser;
      Logger.log('roole_id', role_id);
      if (user.role === role_id) {
        throw new ConflictException('You Cannot Access Same Role');
      }
      const Role: number = parseInt(role_id, 10);
      Logger.log('Role', Role);

      switch (Role) {
        case 1:
          //Method To Retrieve all SA
          return await this.getNormal(getProbizcaUser, user);

        case 2:
          //Get registered BO only
          return await this.getBusiness(getProbizcaUser, user);

        case 4:
        //No Access To Customer

        case 5:
          Logger.log('AffT');
          throw new ConflictException('You Cannot Access Same Role');
          break;

        default:
          Logger.log('No Role');
          return {
            message: 'No ROle FOund',
          };
      }
    } catch (error) {
      throw error;
    }
  }

  //Apply for customer and affiliate
  //To get all customer and affiliate which are registered for the user's businessId
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

      if (!getCustomer) {
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
  private async getNormal(getProbizcaUser: GetProbizcaUser, user: any) {
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

      if (!users) {
        throw new NotFoundException("User's Not Found");
      }

      const nextPageAvailable = page * recordsPerPage < userCount;
      const prevPageAvailable = page > 1;

      return {
        message: "User's Fetched ",
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
