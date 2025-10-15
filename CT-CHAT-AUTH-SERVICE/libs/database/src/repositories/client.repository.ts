import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from '@database/entities';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ClientRepository extends Repository<ClientEntity> {
  constructor(
    @InjectRepository(ClientEntity)
    private clientRepository: Repository<ClientEntity>,
  ) {
    super(
      clientRepository.target,
      clientRepository.manager,
      clientRepository.queryRunner,
    );
  }

  async validateClient(
    client_id: string,
    client_secret_key: string,
  ): Promise<ClientEntity> {
    Logger.log('Inside CLient');
    Logger.log('client_id', client_id, 'client_secret_key', client_secret_key);
    // return await this.clientRepository
    //   .createQueryBuilder('client')
    //   .select(['client.client_id, client.client_secret_key'])
    //   .where('client.client_id = :client_id', { client_id })
    //   .andWhere('client.client_secret_key = :client_secret_key', {
    //     client_secret_key,
    //   })
    //   .getOne();

    return await this.clientRepository.findOne({
      where: {
        client_id: client_id,
        client_secret_key: client_secret_key,
      },
    });
  }

  //CREATE CLIENT
  async createClient(input: object): Promise<ClientEntity> {
    let client = await this.clientRepository.create(input);
    client = await this.clientRepository.save(client);

    return client;
  }

  async validateApiKey(data: string): Promise<boolean> {
    try {
      // Logger.log('INSIDE VALIDATE CLIENT REPO');
      const client = await this.clientRepository
        .createQueryBuilder('client')
        .where('client.apiKey = :apiKey', { apiKey: data })
        .getOne();

      return !!client;
    } catch (error) {
      throw error;
    }
  }
}
