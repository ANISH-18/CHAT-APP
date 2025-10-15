import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthLogsEntitiy } from '@database/entities';

export class AuthLogsRepository extends Repository<AuthLogsEntitiy> {
  constructor(
    @InjectRepository(AuthLogsEntitiy)
    private authLogsRepository: Repository<AuthLogsEntitiy>,
  ) {
    super(
      authLogsRepository.target,
      authLogsRepository.manager,
      authLogsRepository.queryRunner,
    );
  }

  async saveAuthLogs(input: object): Promise<AuthLogsEntitiy> {
    let auth = await this.authLogsRepository.create(input);
    auth = await this.authLogsRepository.save(auth);
    return auth;
  }
}
