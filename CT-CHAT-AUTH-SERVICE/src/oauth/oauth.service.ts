import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotAcceptableException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { AuthorizeRequestDto } from './dto/create-oauth.dto';
import { v4 as uuidv4 } from 'uuid';
import {
  ClientRepository,
  AuthorizationRepository,
  UserRepository,
} from '@database';
import { ExchangeAuthCode } from './dto/exchange_auth_code.dto';
import { AuthHelper } from '@helpers';
import { JwtAuthService } from '@jwt_auth';
import { AuthService } from 'src/auth/auth.service';
import { ClientService } from 'src/client/client.service';

@Injectable()
export class OauthService {
  constructor(
    private readonly authorizationRepository: AuthorizationRepository,
    private readonly authHelper: AuthHelper,
    private readonly jwtAuthService: JwtAuthService,
    private readonly userRepository: UserRepository,
  ) {}

  async handelAuthorize(authorizeRequest: AuthorizeRequestDto, userIp: string) {
    try {
      const { state, email, parent_id, role } = authorizeRequest;
      const generateAuthCode = await this.authHelper.generateAuthCode();
      if (!generateAuthCode) {
        throw new ServiceUnavailableException();
      }

      const Role: number = parseInt(role, 10);
      // const actual_parent_id = parseInt(parent_id, 10)
      // let isValidUser: any;
      // const actual_parent_id = parent_id !== undefined ? parent_id : 0;
      Logger.log('authorizaeRequ', JSON.stringify(authorizeRequest));

      //verify chat Enablement
     

      Logger.log('ROLE', role);
      const isValidUser = await this.userRepository.getValidUser(email, Role, parent_id);

      if (
        isValidUser === null ||
        isValidUser === undefined
        // isValidUser === '[]'
      ) {
        throw new NotFoundException('User Invalid');
      }

       //verify chat enable
       const isChatEnabled = await this.userRepository.verifyChatEnable(isValidUser.user_id)

       if(!isChatEnabled.chatEnabled)
       {
        throw new NotAcceptableException("Chat Disabled for User")
       }



      const saveAuthCode = await this.authorizationRepository.saveAuthCode({
        auth_code: generateAuthCode,
        user_id: isValidUser.user_id,
        state,
        ipAddress: userIp,
      });

      return saveAuthCode;
    } catch (error) {
      Logger.log(error);
      throw error;
    }
  }

  async handelToken(exchangeAuthCode: ExchangeAuthCode) {
    try {
      const { user_id } = exchangeAuthCode;

      const user = await this.userRepository.findById(user_id);

      if (!user) {
        throw new NotFoundException('User not found');
      }
      Logger.log('findUser', JSON.stringify(user));

      //GENERATE ACCESS CODE & REFRESH CODE
      const accessToken = await this.jwtAuthService.generateAccessToken({
        user_id: user.user_id,
        email: user.email,
        role: user.role,
      });

      const refreshToken = await this.jwtAuthService.generateRefreshToken({
        user_id: user.user_id,
        email: user.email,
        role: user.role,
      });

      Logger.log('BEFORE STORING REFRESH TOEKN');

      //Update the refresh token
      await this.updateRefreshToken(user.user_id, refreshToken);

      Logger.log('BEFORE FINDAUTHCODE');

      return {
        message: 'User Logged In  successfully',
        data: {
          accessToken,
          refreshToken,
          user: {
            user_id: user.user_id,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePic: user.profilePic,
            role: user.role,
            email: user.email,
            parent_id: user.parent_id,
            businessName: user.businessName,
          },
        },
      };
    } catch (error) {
      Logger.log(error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  private async updateRefreshToken(
    user_id: string,
    refreshToken?: string | null,
  ) {
    const hashedRefreshToken = refreshToken
      ? await this.authHelper.encodePassword(refreshToken)
      : null;
    await this.userRepository.update(
      { user_id: user_id },
      {
        refreshToken: hashedRefreshToken,
      },
    );
  }

  private async isValidProbizcaUser(
    email: string,
    parent_id: number,
    role: number,
  ) {
    const isValidUser = await this.userRepository.findProbizcaUser(
      email,
      parent_id,
      role,
    );
    Logger.log('isValidProbizca', isValidUser);

    return isValidUser;
  }

  private async validateUser(email: string) {
    //Check if User exist in for the client logic
    // const validUser = 'abc@gmail.com';
    Logger.log('Inside validate User', email);
    Logger.log(email);

    const isValidUser = await this.userRepository.findByEmail(email);
    return isValidUser;
  }

  private async isValidProbizcaCustomer(email: string, role: number) {
    try {
      Logger.log('CHECKING VAILD PROB CUST');
      const isValidCustomer = await this.userRepository.findProbizcaCustomer(
        email,
        role,
      );

      return isValidCustomer;
    } catch (error) {
      throw error;
    }
  }
}

@Injectable()
export class ApiKeyService {
  constructor(
    private clientService: ClientService,
    private readonly authorizationRepository: AuthorizationRepository,
    private readonly authHelper: AuthHelper,
  ) {}

  async verifyAPIkey(data: any) {
    try {
      const isValid = await this.clientService.validateAPIkey(data.apiKey);

      return isValid;
    } catch (error) {
      throw error;
    }
  }

  async generateInternalUri(data: any) {
    try {
      // Logger.log("payload", data)
      const generateAuthCode = await this.authHelper.generateAuthCode();
      if (!generateAuthCode) {
        throw new ServiceUnavailableException();
      }

      const saveAuthCode = await this.authorizationRepository.saveAuthCode({
        auth_code: generateAuthCode,
        user_id: data.user_id,
        state: data.state,
        ipAddress: "0.0.0.0",
      });

      return saveAuthCode;
    } catch (error) {
      Logger.log('error while generateInteralUri');
      throw error;
    }
  }
}
