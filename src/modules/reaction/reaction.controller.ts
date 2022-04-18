import { Controller, Get } from '@nestjs/common';


@Controller()
export class ReactionController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'wow'
  }
}