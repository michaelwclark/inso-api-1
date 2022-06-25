import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Setting, SettingSchema } from 'src/entities/setting/setting';
import { SettingController } from './setting.controller';

@Module({
    imports: [MongooseModule.forFeature([{name: Setting.name, schema: SettingSchema}])],
    controllers: [SettingController],
    providers: [],
})
export class SettingModule {}
