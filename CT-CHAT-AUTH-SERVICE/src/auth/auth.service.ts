import { UserRepository } from '@database/repositories/user.repository';
import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SignUpUserDto } from './dto/signup-user.dto';
import { AuthHelper } from '@helpers';
import { SignInUserDto } from './dto/signin-user.dto';
import { JwtAuthService } from '@jwt_auth';

import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserRegisteredEvent } from '@events';
import { FcmTokenRepository } from '@database/repositories/fcm-token.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authHelper: AuthHelper,
    private readonly jwtAuthService: JwtAuthService,
    private readonly fcmTokenRepository: FcmTokenRepository
  ) {}

  //EVENT DRIVEN DATA SYNC
  async handleUserRegisteredEvent(event: UserRegisteredEvent) {
    try {
      const {
        user_id,
        username,
        firstName,
        lastName,
        profilePic,
        email,
        org_id,
        role,
        parent_id,
        userData,
        businessName,
      } = event.user ?? {};

      const newUser = {
        user_id,
        username,
        firstName,
        lastName,
        profilePic,
        email,
        org_id,
        role,
        parent_id,
        userData,
        businessName,
      };
      // console.log('EVENT LISTENED', newUser);
      const saveUser = await this.userRepository.saveUser(newUser);
      // console.log(saveUser, 'USER SAVED');
    } catch (error) {
      throw error;
    }
  }

  //HTTP METHOD TO SYNC THE DATA
  async syncUser(input: SignUpUserDto) {
    try {
      // const userInDb = await this.userRepository.findByEmail(input.email);
      // if (userInDb) {
      //   throw new ConflictException('User already exists');
      // }

      // input.password = await this.authHelper.encodePassword(input.password);

      const saveUser = await this.userRepository.saveUser(input);

      return {
        message: 'User Registered Successfully...',
        data: saveUser,
      };
    } catch (error) {
      throw error;
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

  async signIn(input: SignInUserDto) {
    try {
      const user = await this.userRepository.findByEmail(input.email);

      if (!user) {
        throw new NotFoundException('Invalid username or password');
      }

      console.log('Checking PAsswrod');

      const isPasswordMatches = await this.authHelper.isPasswordValid(
        input.password,
        user.password,
      );

      if (!isPasswordMatches) {
        throw new ForbiddenException('Invalid user name or password');
      }

      console.log('Valid Password');

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

      await this.updateRefreshToken(user.user_id, refreshToken);
      return {
        message: 'Signed in successfully',
        data: {
          accessToken,
          refreshToken,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async signOut(userId: string) {
    try {
      await this.updateRefreshToken(userId, null);
      return {
        message: 'Signed out successfully',
      };
    } catch (err) {
      throw err;
    }
  }

  async refreshToken(userId: string, token: string) {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user || !user.refreshToken)
        throw new ForbiddenException('Access Denied');

      const refreshTokenMatches = await this.authHelper.isPasswordValid(
        token,
        user.refreshToken,
      );

      if (!refreshTokenMatches) {
        throw new ForbiddenException('Access Invaid Denied');
      }

      const refreshToken = await this.jwtAuthService.generateRefreshToken({
        user_id: user.user_id,
        email: user.email,
        role: user.role,
      });

      await this.updateRefreshToken(user.user_id, refreshToken);

      const accessToken = await this.jwtAuthService.generateAccessToken({
        user_id: user.user_id,
        email: user.email,
        role: user.role,
      });

      return {
        messaage: 'Token refreshed successfully',
        data: {
          accessToken,
          refreshToken,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async forgetPassword(email: string) {
    try {
      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        throw new NotFoundException('Invalid user email');
      }

      const resetToken = await this.jwtAuthService.generateResetPasswordToken({
        user_id: user.user_id,
        email: user.email,
      });

      await this.userRepository.update(
        { user_id: user.user_id },
        { resetToken },
      );
      let clientUrl = process.env.CLIENT_URL;
      const link = `${clientUrl}/resetPassword/${resetToken}`;
      // await this.mailService.sendResetPasswordLink(email, link);
      return {
        message: 'Reset password link sent to your aacount',
      };
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(input: ResetPasswordDto) {
    try {
      const tokenData = await this.jwtAuthService.verifyResetPasswordToken(
        input.resetToken,
      );

      if (!tokenData) {
        throw new NotFoundException('Invalid reset password token');
      }

      const user = await this.userRepository.findById(tokenData);
      // console.log("user",user.email);

      if (!user) {
        throw new NotFoundException(
          'Invalid rest password token, no user found for this token',
        );
      }

      input.password = await this.authHelper.encodePassword(input.password);
      await this.userRepository.update(
        { email: user.email },
        { password: input.password, resetToken: null },
      );

      return {
        message: 'Password reset successfully',
      };
    } catch (error) {
      throw error;
    }
  }


  async registerFcmToken(data: any){
    try {

      const {email, role, parent_id, fcmToken, deviceType} = data;
      
      const user = await this.userRepository.findProbizcaUser(email, parent_id, role);

      if(!user){
        throw new NotFoundException("User Not Found")
      }

      const storeToken = await this.fcmTokenRepository.registerToken(user, fcmToken, deviceType);

      return {
        data: storeToken
      }

    } catch (error) {
      Logger.error("Error While Registering Token")
      throw error;
    }
  }


  async getFcmTokens(data: any){
    try {
  
      // console.log('service', user_id);
      const {user_id} = data;

      const user = await this.userRepository.findByUserId(user_id);


      
      if(!user){
        throw new NotFoundException("User Not Found")
      }

      const tokenData = await this.fcmTokenRepository.getFcmToken(user.user_id)

      return {
        data: tokenData,
      }
      
    } catch (error) {
      Logger.log("error while getting user tokens")
      throw error;
    }
  }

  async updateFcmTokens(data: any){
    try {
      
      const {email, role, parent_id, fcmToken, deviceType} = data;
      
      const user = await this.userRepository.findProbizcaUser(email, parent_id, role);

      if(!user){
        throw new NotFoundException("User Not Found")
      }

      //check existing token 
      const existingToken = await this.fcmTokenRepository.getTokenByDeviceType(user.user_id, deviceType);

      Logger.log("Exisiting", JSON.stringify(existingToken))
      if(existingToken)
      {
        existingToken.fcmToken = fcmToken;
        existingToken.lastUsed = new Date();

        await this.fcmTokenRepository.save(existingToken);
        Logger.log('FCM Token updated successfully');
      }
      else{
        const storeToken = await this.fcmTokenRepository.registerToken(user, fcmToken, deviceType);
      }

      return {
        message: "Token Updated Successfully",
        data: {
          user_id: user.user_id
        }
      }


    } catch (error) {
      Logger.error("Error While updating token")
    }
  }

  async deleteFcmTokens(data: any){
    try {
      
      const {email, role, parent_id, deviceType} = data;
      
      const user = await this.userRepository.findProbizcaUser(email, parent_id, role);

      if(!user){
        throw new NotFoundException("User Not Found")
      }

      const deleteToken = await this.fcmTokenRepository.deleteFcmByDeviceType(user.cred_id, deviceType)

      return {
        message: "Token Deleted Successfully",
        data: deleteToken
      }
    } catch (error) {
      Logger.log("Error While Delete DeviceType Token")
      throw error;
    }
  }
}
