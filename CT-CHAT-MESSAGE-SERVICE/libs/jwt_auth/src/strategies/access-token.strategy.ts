import { UserMongoRepo } from 'libs/mongo_database/src/repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload = {
  sub: string;
  username: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userRepository: UserMongoRepo) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      ignoreNotBefore: true,
    });
  }

  async validate(payload: JwtPayload) {
    const { sub: userId } = payload;

    const user = await this.userRepository.findByEmail(userId);

    if (!user) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
