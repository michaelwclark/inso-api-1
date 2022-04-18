import { Controller, Get } from '@nestjs/common';


@Controller()
export class SettingController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'wow'
  }
}