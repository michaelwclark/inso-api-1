import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Discussion, DiscussionSchema } from 'src/entities/discussion/discussion';
import { GradeSchema, Grade } from 'src/entities/grade/grade';
import { GradeController } from './grade.controller';
import { GradeService } from './grade.service';

@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([{ name: Grade.name, schema: GradeSchema }]),
        MongooseModule.forFeature([{ name: Discussion.name, schema: DiscussionSchema }]),
    ],
    controllers: [GradeController],
    providers: [GradeService],
    exports: [GradeService]
})
export class GradeModule {}
