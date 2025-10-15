import { UserRepository } from '@database';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload = {
  sub: string;
  email: string;
  role: number;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      ignoreNotBefore: true,
    });
  }

  async validate(payload: JwtPayload) {
    const { sub: userId, email: email, role: role } = payload;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
