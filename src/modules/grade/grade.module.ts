import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GradeSchema, Grade } from 'src/entities/grade/grade';
import { GradeController } from './grade.controller';
import { GradeService } from './grade.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Grade.name, schema: GradeSchema }])],
    controllers: [GradeController],
    providers: [GradeService],
    exports: [GradeService]
})
export class GradeModule {}
