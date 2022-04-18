import { Controller, Get } from '@nestjs/common';


@Controller()
export class InspirationController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'wow'
  }
}