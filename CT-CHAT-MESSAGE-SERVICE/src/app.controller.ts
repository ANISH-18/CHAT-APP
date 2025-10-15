import { Controller, Get, Logger } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('App ')
@Controller()
export class AppController {
  constructor() {}

  @ApiProperty({ example: 'Health Check' })
  @Get('health-check')
  getHello() {
    return { message: 'Health Check-message service' };
  }
}
