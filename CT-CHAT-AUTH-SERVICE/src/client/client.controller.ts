import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  InternalServerErrorException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { ApiKeyGuard } from '@jwt_auth';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('create')
  async create(@Query() input: CreateClientDto) {
    try {
      Logger.log('Controller Level');

      return await this.clientService.create(input);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        'Error creating client in controller',
      );
    }
  }


  @UseGuards(ApiKeyGuard)
  @Post('chat')
  chatEnabled(@Body() data: {parent_id: number, chatEnabled: boolean}){
    return this.clientService.chatEnabled(data)
  }
}
