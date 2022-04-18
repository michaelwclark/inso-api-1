import { Controller, Get } from '@nestjs/common';


@Controller()
export class SettingController {
  constructor() {}

  @Get('setting')
  getHello(): string {
    return 'setting'
  }
}