import { Controller, Get, Body, Post, Patch } from '@nestjs/common';
import { SettingsCreateDTO } from 'src/entities/setting/create-setting';


@Controller()
export class SettingController {
  constructor() {}

  @Get('setting')
  getHello(): string {
    return 'setting'
  }






  // updateDiscussionSettings(@Body() discussion: SettingsCreateDTO ): string {
  //   console.log(discussion)
  //   return 'update discussion settings'
  // }

  @Patch('setting')
  async updateDiscussionMetadata(@Body() discussion: Partial<SettingsCreateDTO>): Promise<string> {
    console.log(discussion);
    return 'update discussion metadata'
  }

}