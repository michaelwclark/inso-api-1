import { Controller, Get, Body, Post, Patch, Delete, Param } from '@nestjs/common';
import { SettingsCreateDTO } from 'src/entities/setting/create-setting';
import { SettingsEditDTO } from 'src/entities/setting/edit-setting';


@Controller()
export class SettingController {

  @Get('setting')
  getHello(): string {
    return 'setting'
  }
  

  



}