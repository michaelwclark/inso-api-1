import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Discussion,
  DiscussionSchema,
} from 'src/entities/discussion/discussion';
import { DiscussionPost, DiscussionPostSchema } from 'src/entities/post/post';
import { User, UserSchema } from 'src/entities/user/user';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from 'src/auth/guards/jwt.strategy';
import { Reaction, ReactionSchema } from 'src/entities/reaction/reaction';
import { AnalyticsController } from './analytics.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Discussion.name, schema: DiscussionSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: DiscussionPost.name, schema: DiscussionPostSchema },
    ]),
    MongooseModule.forFeature([
      { name: Reaction.name, schema: ReactionSchema },
    ]),
    AuthModule,
    UserModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsController, JwtStrategy],
})
export class AnalyticsModule {}
