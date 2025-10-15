import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { AccessTokenGuard, GetCurrentUserId } from '@jwt_auth';
import { CreateConvDto } from './dto/create-conversation.dto';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Conversation')
@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  //CREATE A CONVERSATION
  @ApiProperty({ title: 'Create Conversation' })
  @UseGuards(AccessTokenGuard)
  @Post('createConversation')
  handelConvCreate(
    @Body() input: CreateConvDto,
    @GetCurrentUserId() user_id: string,
  ) {
    return this.conversationService.createConv(input, user_id);
  }

  @ApiProperty({ title: 'Find Conversation' })
  //FIND CONVERATION
  @UseGuards(AccessTokenGuard)
  @Get('findConv')
  handelGetConv(
    @Query('sender_id') sender_id: string,
    @GetCurrentUserId() user_id,
  ) {
    return this.conversationService.findConv(sender_id, user_id);
  }
}
