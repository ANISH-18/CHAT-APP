import { Controller, Get, Logger } from '@nestjs/common';
@Controller()
export class AppController {
  constructor() {}

  @Get('health-check')
  getHello() {
    Logger.log("Health Ccheck Notification service");
    return { message: 'Health Check'};
  }
}
