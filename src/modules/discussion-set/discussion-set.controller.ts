import { Controller, Get } from '@nestjs/common';


@Controller()
export class DiscussionSetController {
  constructor() {}

  @Get('discussion-set')
  getHello(): string {
    return 'discussion-set'
  }
}