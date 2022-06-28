import { Controller, Get, Body, Post, Patch } from '@nestjs/common';
import { SettingsCreateDTO } from 'src/entities/setting/create-setting';

@Controller()
export class SettingController { 
  createSetting(validDiscussionId: { id: string, prompt: string, post_inspiration: string[], score: string, calendar: string, userId: string;}): any {
    throw new Error('Method not implemented.');
   
  }
  constructor() {}

  @Get('setting')
  getHello(): string {
    return 'setting'
  }


  @Patch('setting')
  async updateDiscussionMetadata(@Body() discussion: Partial<SettingsCreateDTO>): Promise<string> {
    console.log(discussion);
    return 'update discussion metadata'
  }

}