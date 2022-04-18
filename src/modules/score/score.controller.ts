import { Controller, Get } from '@nestjs/common';


@Controller()
export class ScoreController {
  constructor() {}

  @Get('score')
  getHello(): string {
    return 'score'
  }
}