import { Controller, Get, Body, Post, Patch } from '@nestjs/common';
import { SettingsCreateDTO } from 'src/entities/setting/create-setting';

//{_id: string, prompt: string, inspiration: string[], score: string, calendar: string, userId: string;} 
@Controller()
export class SettingController { 
  createSetting(validDiscussionSetting: { name: string; poster: import("mongoose").Types.ObjectId; facilitators: any[];}): any {
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