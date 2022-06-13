import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GradeController } from './grade.controller';

@Module({
    // TODO Add Schema
    //imports: [MongooseModule.forFeature([{ name: '', schema: '' }])],
    controllers: [GradeController],
    providers: [],
})
export class GradeModule {}
