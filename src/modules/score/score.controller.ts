import { Controller, Get } from '@nestjs/common';


@Controller()
export class ScoreController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'wow'
  }
}