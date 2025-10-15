import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotAcceptableException,
} from '@nestjs/common';

import { ClientRepository, UserRepository } from '@database';
import { AuthHelper } from '@helpers';
import { CreateClientDto } from './dto/create-client.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { RabbitMQService } from '@Rabbitmq/rabbitmq/rabbitmq.service';

@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly authHelper: AuthHelper,
    private readonly userRepository: UserRepository,
    private eventEmitter: EventEmitter2,
    private readonly rmq: RabbitMQService,
  ) {}

  async create(data: CreateClientDto) {
    try {
      const secretKey = await this.authHelper.generateSecretKey();

      const apiKey = await this.authHelper.generateAPIKey();

      Logger.log('secretKey', secretKey);
      const { org_id } = data;

      const input = {
        client_secret_key: secretKey,
        org_id: org_id,
        apiKey: apiKey,
      };

      Logger.log(input);
      const createClient = await this.clientRepository.createClient(input);

      if (!createClient) {
        throw new InternalServerErrorException('Unable to create client');
      }

      Logger.log('createClient', JSON.stringify(createClient));

      return {
        data: createClient,
      };
    } catch (error) {
      throw error;
    }
  }

  async validateAPIkey(key: string) {
    // Logger.log('inside client service');
    //VALIDATE API KEY
    try {
      return await this.clientRepository.validateApiKey(key);
    } catch (error) {
      throw error;
    }
  }


  async chatEnabled(data: {parent_id: number, chatEnabled: boolean}){
    try {
      const chatEnableMent = await this.userRepository.chatEnabled(data);

      if(chatEnableMent.affected === 0)
      {
        throw new NotAcceptableException("Failed to Accept the Request")
      }
      else{
        if(data.chatEnabled ==true)
        {
          return {
            message: "Chat Enabled for Parent.",
            
          }
        }
        else{
          this.eventEmitter.emit('disable.chat', data.parent_id)
          return {
            message: "Chat Disable for Parent. Active Session Will be Soon disbaled",
          }
        }
      }

      //Logic to Handle Online User Socket 

    
    } catch (error) {
      Logger.error("Disable Sub Organization")
      throw error;
    }
  }



  @OnEvent('disable.chat')
  async disableChat(data: number){
    try {
      const getUserIds = await this.userRepository.getUserIds(data);

      //Emit the user to message service to make it disable from chat if session is Active
      
      const disbaleUsersPromise = getUserIds.map(async (data) => {
        await this.rmq.disableUser(data.user_id)
      })

      await Promise.all(disbaleUsersPromise);
      Logger.log(`Processed all userIds for parent_id: ${data}`);
    } catch (error) {
      Logger.error("Start Process to Remove Online Users")
      throw error;
    }
  }
}
