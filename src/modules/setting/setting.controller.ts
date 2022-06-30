import { Controller, Get, Body, Post, Patch, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiBody } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { SettingsCreateDTO } from 'src/entities/setting/create-setting';
import { SettingsEditDTO } from 'src/entities/setting/edit-setting';
import { Setting } from 'src/entities/setting/setting';

@Controller()
export class SettingController { 
    
   constructor(
    @InjectModel(Setting.name) private settingModel: Model<Setting>,

   ) {}
  
  // async createSetting(@Param('validDiscussionId')  id: string, prompt: string, post_inspiration: string[], score: string, calendar: string, userId: string;): any {
  //   throw new Error('Method not implemented.');
  // }

  }

