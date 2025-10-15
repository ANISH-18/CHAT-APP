import { JwtPayload } from '@jwt_auth/types';
import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserMongoRepo } from '@MongoDB/repository';

@Injectable()
export class WsJWTStrategy extends PassportStrategy(Strategy, 'wsjwt') {
  constructor(
    // @InjectRepository(UserMongoRepo)
    private readonly userRepository: UserMongoRepo,
  ) {
    super({
      // jwtFromRequest: ExtractJwt.fromUrlQueryParameter('bearerToken'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const { sub } = payload;
    // Logger.log('SUb inside ws-access-token', sub);

    try {
      // return this.user;
      // console.log('CHECKING TOKEN');
      Logger.log('CHECKING TOKEN');
      const userId: string = sub.toString();

      const user = await this.userRepository.findByUserId(userId);

      return user;
    } catch (error) {
      Logger.log('Error validating token:', error);
      console.error('Error validating token:', error);
      throw new WsException('UnAuthorized Access');
    }
  }
}
