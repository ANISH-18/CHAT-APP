import { Controller, Get } from '@nestjs/common';
@Controller()
export class AppController {
  constructor() {}

  @Get('health-check')
  getHello() {
    return { message: 'Health Check'};
  }
}
