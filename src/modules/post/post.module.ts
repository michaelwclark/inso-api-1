import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Discussion, DiscussionSchema } from 'src/entities/discussion/discussion';
import { Inspiration, InspirationSchema } from 'src/entities/inspiration/inspiration';
import { Milestone, MilestoneSchema } from 'src/entities/milestone/milestone';
import { Notification, NotificationSchema } from 'src/entities/notification/notification';
import { DiscussionPost, DiscussionPostSchema } from 'src/entities/post/post';
import { Setting, SettingSchema } from 'src/entities/setting/setting';
import { NotificationModule } from '../notification/notification.module';
import { PostController } from './post.controller';

@Module({
    imports: [
        NotificationModule,
        MongooseModule.forFeature([{ name: DiscussionPost.name, schema: DiscussionPostSchema }]),
        MongooseModule.forFeature([{ name: Discussion.name, schema: DiscussionSchema }]),
        MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
        MongooseModule.forFeature([{ name: Milestone.name, schema: MilestoneSchema }]),
        MongooseModule.forFeature([{ name: Inspiration.name, schema: InspirationSchema }]),
        MongooseModule.forFeature([{ name: Setting.name, schema: SettingSchema }])
    ],
    controllers: [PostController],
    providers: [],
})
export class PostModule {}
