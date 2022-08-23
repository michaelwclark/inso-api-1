import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Discussion, DiscussionSchema } from 'src/entities/discussion/discussion';
import { GradeSchema, Grade } from 'src/entities/grade/grade';
import { DiscussionPost, DiscussionPostSchema } from 'src/entities/post/post';
import { Setting, SettingSchema } from 'src/entities/setting/setting';
import { DiscussionController } from '../discussion/discussion.controller';
import { GradeController } from './grade.controller';
import { GradeService } from './grade.service';

@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([{ name: Grade.name, schema: GradeSchema }]),
        MongooseModule.forFeature([{ name: Discussion.name, schema: DiscussionSchema }]),
        MongooseModule.forFeature([{ name: DiscussionPost.name, schema: DiscussionPostSchema }]),
        MongooseModule.forFeature([{name: Setting.name, schema: SettingSchema}])
        
    ],
    controllers: [GradeController],
    providers: [GradeService], //, DiscussionController],
    exports: [GradeService]
})
export class GradeModule {}
