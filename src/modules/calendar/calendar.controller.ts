import { Controller, Get } from '@nestjs/common';


@Controller()
export class CalendarController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'wow'
  }
}