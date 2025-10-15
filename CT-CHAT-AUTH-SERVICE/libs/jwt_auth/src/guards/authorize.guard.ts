import { ClientRepository, UserRepository } from '@database';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly userRepository: UserRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // Logger.log('inside authorize guard');

    // Logger.log('USER QUERY', request.query);

    const clientId = request.query.client_id;
    // const email = request.query.email;
    const client_secret_key = request.query.client_secret_key;
    // const role = request.query.role;
    // const parent_id = request.query.parent_id;

    // Logger.log('CLIENT_SECRET_KET', client_secret_key);

    // Logger.log('Before validate Client', clientId);
    //First Verify Applications CliendId
    const isValidClientId = await this.validateClientCredentials(
      clientId,
      client_secret_key,
    );

    // const isValidClientId = await this.clientRepository.validateClient(
    //   clientId,
    // );

    // Logger.log('after validate Client', JSON.stringify(isValidClientId));
    if (!isValidClientId) {
      throw new NotFoundException('Client Id Invalid');
    }

    //Verify Active User based on ClientId

    // Logger.log('Email', email);
    // let isValidProbizcaUser: any;
    // let isValidCleintEmail: any;

    // Logger.log('role', role, 'parent_id', parent_id);

    // if (role !== undefined && parent_id !== undefined) {
    //   Logger.log('Checking Probizca User');
    //   isValidProbizcaUser = await this.isValidProbizcaUser(
    //     email,
    //     parent_id,
    //     role,
    //   );
    // } else {
    //   Logger.log('Normal User');
    //   isValidCleintEmail = await this.validateUser(email);
    // }

    // Logger.log(
    //   'after validate User',
    //   JSON.stringify(isValidCleintEmail) || JSON.stringify(isValidProbizcaUser),
    // );

    // if (
    //   (!isValidCleintEmail || isValidCleintEmail === '[]') &&
    //   (!isValidProbizcaUser || isValidProbizcaUser === '[]')
    // ) {
    //   throw new NotFoundException('User Invalid');
    // }
    // //If Valid ClientID then Verify User
    // const user = request.user;
    // return user;
    return true;
  }

  private async validateClientCredentials(
    client_id: string,
    client_secret_key: string,
  ) {
    try {
      // Logic To find a Valid Clientid
      // Logger.log('Inside validate ');

      const isValidClient = await this.clientRepository.validateClient(
        client_id,
        client_secret_key,
      );
      // Logger.log('Outside validate ', isValidClient);
      return isValidClient;
    } catch (error) {
      Logger.error(error.message, error.stack, 'AuthorizeGuard');
      throw new InternalServerErrorException(
        'Error validating client credentials',
      );
    }
  }

  private async validateUser(email: string) {
    //Check if User exist in for the client logic
    // const validUser = 'abc@gmail.com';
    Logger.log('Inside validate User', email);
    Logger.log(email);

    const isValidUser = await this.userRepository.findByEmail(email);
    return isValidUser;
  }

  private async isValidProbizcaUser(email: string, parent_id: number, role) {
    const isValidUser = await this.userRepository.findProbizcaUser(
      email,
      parent_id,
      role,
    );
    Logger.log('isValidProbizca', isValidUser);

    return isValidUser;
  }
}
