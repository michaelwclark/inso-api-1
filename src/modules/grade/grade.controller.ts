import { Controller, Get } from '@nestjs/common';


@Controller()
export class GradeController {
  constructor() {}

  @Get('grade')
  getHello(): string {
    return 'grade'
  }
}