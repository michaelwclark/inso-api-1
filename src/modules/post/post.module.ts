import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Discussion, DiscussionSchema } from 'src/entities/discussion/discussion';
import { Inspiration, InspirationSchema } from 'src/entities/inspiration/inspiration';
import { Milestone, MilestoneSchema } from 'src/entities/milestone/milestone';
import { Notification, NotificationSchema } from 'src/entities/notification/notification';
import { DiscussionPost, DiscussionPostSchema } from 'src/entities/post/post';
import { Setting, SettingSchema } from 'src/entities/setting/setting';
import { User, UserSchema } from 'src/entities/user/user';
import { NotificationModule } from '../notification/notification.module';
import { NotificationService } from '../notification/notification.service';
import { PostController } from './post.controller';

@Module({
    imports: [
        AuthModule,
        NotificationModule,
        MongooseModule.forFeature([{ name: DiscussionPost.name, schema: DiscussionPostSchema }]),
        MongooseModule.forFeature([{ name: Discussion.name, schema: DiscussionSchema }]),
        MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
        MongooseModule.forFeature([{ name: Milestone.name, schema: MilestoneSchema }]),
        MongooseModule.forFeature([{ name: Inspiration.name, schema: InspirationSchema }]),
        MongooseModule.forFeature([{ name: Setting.name, schema: SettingSchema }]),
        MongooseModule.forFeature([ {name: User.name, schema: UserSchema }])
    ],
    controllers: [PostController],
    providers: [],
})
export class PostModule {}
