import { Controller, Get } from '@nestjs/common';


@Controller()
export class DiscussionController {
  constructor() {}

  @Get('discussion')
  getHello(): string {
    return 'discussion'
  }
}