import { UserRepository } from '@database/repositories/user.repository';
import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUpUserDto } from './dto/signup-user.dto';
import { AuthHelper } from '@helpers';
import { SignInUserDto } from './dto/signin-user.dto';
import { JwtAuthService } from '@jwt_auth';
import { MailService } from '@mail';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authHelper: AuthHelper,
    private readonly jwtAuthService: JwtAuthService,
    private readonly mailService: MailService,
  ) {}

  async signUp(input: SignUpUserDto) {
    try {
      const userInDb = await this.userRepository.findByEmail(input.email);

      if (userInDb) {
        throw new ConflictException('User already exists');
      }

      input.password = await this.authHelper.encodePassword(input.password);

      let user = await this.userRepository.create(input);
      user = await this.userRepository.save(user);

      return {
        message: 'User Registered Successfully...',
        data: user,
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

      const isPasswordMatches = await this.authHelper.isPasswordValid(
        input.password,
        user.password,
      );

      if (!isPasswordMatches) {
        throw new ForbiddenException('Invalid user name or password');
      }

      const accessToken = await this.jwtAuthService.generateAccessToken({
        userId: user.user_id,
        email: user.email,
      });
      const refreshToken = await this.jwtAuthService.generateRefreshToken({
        userId: user.user_id,
        email: user.email,
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

  async signOut(user_id: string) {
    try {
      await this.updateRefreshToken(user_id, null);
      return {
        message: 'Signed out successfully',
      };
    } catch (err) {
      throw err;
    }
  }

  async refreshToken(user_id: string, token: string) {
    try {
      const user = await this.userRepository.findById(user_id);

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
        userId: user.user_id,
        email: user.user_id,
      });

      await this.updateRefreshToken(user.user_id, refreshToken);

      const accessToken = await this.jwtAuthService.generateAccessToken({
        userId: user.user_id,
        email: user.email,
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
        userId: user.user_id,
        email: user.email,
      });

      await this.userRepository.update(
        { user_id: user.user_id },
        { resetToken },
      );
      let clientUrl = process.env.CLIENT_URL;
      const link = `${clientUrl}/resetPassword/${resetToken}`;
      await this.mailService.sendResetPasswordLink(email, link);
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
}
