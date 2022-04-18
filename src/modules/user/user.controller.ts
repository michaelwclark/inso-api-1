import { Controller, Get } from '@nestjs/common';


@Controller()
export class UserController {
  constructor() {}

  @Get('user')
  getHello(): string {
    return 'user'
  }
}