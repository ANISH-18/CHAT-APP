import { AuthorizationRepository } from '@database';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';

@Injectable()
export class AuthorizationCode implements CanActivate {
  constructor(
    private readonly authorizationRepository: AuthorizationRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const Request = context.switchToHttp().getRequest();

    Logger.log('Inside Authorization Code ');

    //Extract authorization code
    const authorizationCode = Request.query.authorization_code;
    const state = Request.query.state;
    const user_id = Request.query.user_id;

    // const ipAddress = Request.ip;

    // Logger.log('ipAddress', ipAddress);

    if (!authorizationCode) {
      throw new NotFoundException('authorization code not found');
    }

    if (!state) {
      throw new NotFoundException('state code not found');
    }

    const input = {
      authorization_code: authorizationCode,
      state,
      // ipAddress,
      user_id,
    };

    Logger.log('input', input);

    Logger.log('authorizationCode', authorizationCode);
    const isValid = await this.validateAuthorizationCode(input);

    Logger.log('isValid', isValid);

    if (!isValid) {
      throw new UnauthorizedException('UnAuthorized User');
    }

    return true;
  }

  private async validateAuthorizationCode(input: any) {
    //Validate authorization code
    //Authorization code logic to be added here to extract user from db
    //WORK HERE
    const isValidCode = await this.authorizationRepository.findAuthCode(input);
    Logger.log('isValidCode', isValidCode);
    return isValidCode;
  }
}
