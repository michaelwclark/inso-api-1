import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InspirationController } from './inspiration.controller';

@Module({
    // TODO Add Schema
    imports: [MongooseModule.forFeature([{ name: '', schema: '' }])],
    controllers: [InspirationController],
    providers: [],
})
export class InspirationModule {}
