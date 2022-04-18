import { Controller, Get } from '@nestjs/common';


@Controller()
export class InspirationController {
  constructor() {}

  @Get('inspiration')
  getHello(): string {
    return 'inspiration'
  }
}