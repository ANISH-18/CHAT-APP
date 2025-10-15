import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorizationEntity } from '@database/entities';
import { InternalServerErrorException, Logger } from '@nestjs/common';

export class AuthorizationRepository extends Repository<AuthorizationEntity> {
  constructor(
    @InjectRepository(AuthorizationEntity)
    private authorizationRepository: Repository<AuthorizationEntity>,
  ) {
    super(
      authorizationRepository.target,
      authorizationRepository.manager,
      authorizationRepository.queryRunner,
    );
  }

  async saveAuthCode(input: {
    auth_code: string;
    user_id: string;
    state: string;
    ipAddress: string;
  }): Promise<AuthorizationEntity> {
    // console.log('input', input);
    let auth = await this.authorizationRepository.create(input);
    auth = await this.authorizationRepository.save(auth);
    return auth;
  }

  async findAuthCode(exchangeAuthCode: {
    authorization_code: string;
    state: string;
    user_id: string;
  }): Promise<AuthorizationEntity> {
    try {
      Logger.log('exchangeAuthCode', exchangeAuthCode);
      const { authorization_code, state, user_id } = exchangeAuthCode;

      const result = await this.createQueryBuilder('authorization')
        .where('authorization.auth_code = :authCode', {
          authCode: authorization_code,
        })
        .andWhere('authorization.state = :state', { state })

        .andWhere('authorization.user_id = :user_id', { user_id })
        .getOne();

      Logger.log('result', result);

      return result || null;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error finding authorization code',
      );
    }
  }
}
