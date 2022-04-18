import { Controller, Get } from '@nestjs/common';


@Controller()
export class GradeController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'wow'
  }
}