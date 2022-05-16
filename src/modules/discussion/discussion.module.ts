import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Discussion, DiscussionSchema } from 'src/entities/discussion/discussion';
import { DiscussionController } from './discussion.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: Discussion.name, schema: DiscussionSchema }])],
    controllers: [DiscussionController],
    providers: [],
})
export class DiscussionModule {}
