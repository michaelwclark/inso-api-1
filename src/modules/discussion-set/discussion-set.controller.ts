import { Controller, Get } from '@nestjs/common';


@Controller()
export class DiscussionSetController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'wow'
  }
}