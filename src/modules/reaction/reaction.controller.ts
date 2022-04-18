import { Controller, Get } from '@nestjs/common';


@Controller()
export class ReactionController {
  constructor() {}

  @Get('reaction')
  getHello(): string {
    return 'reaction'
  }
}