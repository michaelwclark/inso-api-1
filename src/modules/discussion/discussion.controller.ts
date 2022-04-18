import { Controller, Get } from '@nestjs/common';


@Controller()
export class DiscussionController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'wow'
  }
}