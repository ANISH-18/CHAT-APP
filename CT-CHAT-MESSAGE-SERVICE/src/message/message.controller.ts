import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { AccessTokenGuard, GetCurrentUserId } from '@jwt_auth';
import { CreateConvDto } from '../conversation/dto/create-conversation.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
}
