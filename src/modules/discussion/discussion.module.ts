import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Discussion, DiscussionSchema } from 'src/entities/discussion/discussion';
import { Inspiration, InspirationSchema } from 'src/entities/inspiration/inspiration';
import { DiscussionPost, DiscussionPostSchema } from 'src/entities/post/post';
import { User, UserSchema } from 'src/entities/user/user';
import { DiscussionController } from './discussion.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Discussion.name, schema: DiscussionSchema }]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: DiscussionPost.name, schema: DiscussionPostSchema }]),
        MongooseModule.forFeature([{ name: Inspiration.name, schema: InspirationSchema}])
    ],
    controllers: [DiscussionController],
    providers: [],
})
export class DiscussionModule {}
