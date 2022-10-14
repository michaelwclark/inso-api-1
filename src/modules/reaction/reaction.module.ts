import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import {
  Discussion,
  DiscussionSchema,
} from 'src/entities/discussion/discussion';
import { DiscussionPost, DiscussionPostSchema } from 'src/entities/post/post';
import { Reaction, ReactionSchema } from 'src/entities/reaction/reaction';
import { User, UserSchema } from 'src/entities/user/user';
import { MilestoneModule } from '../milestone/milestone.module';
import { NotificationModule } from '../notification/notification.module';
import { ReactionController } from './reaction.controller';

@Module({
  imports: [
    AuthModule,
    NotificationModule,
    MilestoneModule,
    MongooseModule.forFeature([
      { name: DiscussionPost.name, schema: DiscussionPostSchema },
    ]),
    MongooseModule.forFeature([
      { name: Reaction.name, schema: ReactionSchema },
    ]),
    MongooseModule.forFeature([
      { name: Discussion.name, schema: DiscussionSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [ReactionController],
  providers: [],
})
export class ReactionModule {}
