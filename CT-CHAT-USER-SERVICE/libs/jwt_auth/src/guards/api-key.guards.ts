import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RabbitMQService } from 'libs/rabbitmq/src';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly rabbitmqservice: RabbitMQService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const apiKey = request.headers['x-api-key'];

    Logger.log('API KEY', apiKey);

    if (!apiKey) {
      throw new NotFoundException('Api key not found');
    }

    //check valid API key

    const isValidAPi = await this.checkApikey(apiKey);

    if (isValidAPi !== true) {
      Logger.error('Invalid API key');
      throw new UnauthorizedException('Invalid API key');
    }
    Logger.log('IS VALID API', isValidAPi);
    return true;
  }

  private async checkApikey(apiKey: string) {
    // Logger.log('CHECKING API KEY', apiKey);
    return await this.rabbitmqservice.verifyAPIKey(apiKey);
  }
}
