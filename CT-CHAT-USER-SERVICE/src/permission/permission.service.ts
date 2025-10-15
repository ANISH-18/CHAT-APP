import { PermissionRepository } from '@database';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CheckPermissionDto } from './dto/check-permission.dto';
import { canChat } from '@helpers/constants';
type ChatMatrix = Record<string, Array<Record<string, number>>>;

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async createPermissions(jsonInput) {
    try {
      for (const key in jsonInput) {
        if (jsonInput.hasOwnProperty(key)) {
          const values = jsonInput[key];

          //Generating Combination of key-value
          for (const valueObj of values) {
            const valueKey = Object.keys(valueObj)[0];
            const value = await valueObj[valueKey];

            console.log(`${key},${valueKey}: ${value}`);
            Logger.log(`${key},${valueKey}`);
            Logger.log(`${value}`);

            await this.permissionRepository.createPermission(
              key,
              valueKey,
              value,
            );
          }
        }
      }
      return {
        message: "Permission's Added Successfully",
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async checkPermission(checkPermissionDto: CheckPermissionDto) {
    try {
      const { role_A, role_B } = checkPermissionDto;
      Logger.log(`${role_A},${role_B}`, 'permission.service');
      const Permission = await this.permissionRepository.checkPermission(
        role_A,
        role_B,
      );

      if (!Permission || Permission.length === 0) {
        throw new NotFoundException('Permission Not Found ');
      }

      Logger.log('Permission', JSON.stringify(Permission));

      if (Permission.canChat === 0) {
        return {
          message: 'Cannot Chat With the User',
          data: Permission,
        };
      }

      return {
        message: 'Success Chat With the User',
        data: Permission,
      };
    } catch (error) {
      throw error;
    }
  }

  async getRoles(role_id: number) {
    try {
      const roles = await this.permissionRepository.findRoles(
        role_id,
        canChat.Yes,
      );

      return {
        data: roles,
      };
    } catch (error) {
      throw error;
    }
  }

  private async validateChatMatrix(chatMatrix: ChatMatrix) {
    //Rule 1 Check Each UserId has other UserID
    for (const User_Id in chatMatrix) {
      if (!Array.isArray(chatMatrix[User_Id])) {
        return false;
      }
    }

    //Rule 2 Check if Flag is Eitheir 1 or 0
    for (const userId in chatMatrix) {
      const userPairs = chatMatrix[userId];

      for (const userPair of userPairs) {
        const targetUserId = Object.keys(userPair)[0];
        const flag = userPair[targetUserId];

        if (flag !== 0 && flag !== 1) {
          return false;
        }
      }
    }

    //Check if Matrix is Symmetric
    for (const userId in chatMatrix) {
      const userPairs = chatMatrix[userId];

      for (const userPair of userPairs) {
        const targetUserId = Object.keys(userPair)[0];

        // Check if the reverse pair exists and has the same flag
        const reversePair = chatMatrix[targetUserId].find(
          (pair) => Object.keys(pair)[0] === userId,
        );
        if (!reversePair || userPair[targetUserId] !== reversePair[userId]) {
          return false;
        }
      }
    }
  }
}
