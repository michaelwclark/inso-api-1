import { Module } from '@nestjs/common';
import { SettingController } from './setting.controller';

@Module({
    imports: [],
    controllers: [SettingController],
    providers: [],
})
export class SettingModule {}
