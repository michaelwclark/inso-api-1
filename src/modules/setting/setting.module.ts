import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingController } from './setting.controller';

@Module({
    //imports: [MongooseModule.forFeature([{ name: '', schema: '' }])],
    controllers: [SettingController],
    providers: [],
})
export class SettingModule {}
