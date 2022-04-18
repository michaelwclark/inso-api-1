import { Controller, Get } from '@nestjs/common';


@Controller()
export class CalendarController {
  constructor() {}

  @Get('calendar')
  getHello(): string {
    return 'calendar'
  }
}