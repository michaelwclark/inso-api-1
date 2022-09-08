import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reaction, ReactionSchema } from 'src/entities/reaction/reaction';
import { AuthModule } from '../../auth/auth.module';
import { Discussion, DiscussionSchema } from '../../entities/discussion/discussion';
import { Inspiration, InspirationSchema } from '../../entities/inspiration/inspiration';
import { Milestone, MilestoneSchema } from '../../entities/milestone/milestone';
import { Notification, NotificationSchema } from '../../entities/notification/notification';
import { DiscussionPost, DiscussionPostSchema } from '../../entities/post/post';
import { Setting, SettingSchema } from '../../entities/setting/setting';
import { User, UserSchema } from '../../entities/user/user';
import { MilestoneModule } from '../milestone/milestone.module';
import { NotificationModule } from '../notification/notification.module';
import { PostController } from './post.controller';

@Module({
    imports: [
        AuthModule,
        NotificationModule,
        MilestoneModule,
        MongooseModule.forFeature([{ name: DiscussionPost.name, schema: DiscussionPostSchema }]),
        MongooseModule.forFeature([{ name: Discussion.name, schema: DiscussionSchema }]),
        MongooseModule.forFeature([{ name: Reaction.name, schema: ReactionSchema }]),
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
