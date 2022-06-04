import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';
import { SettingModule } from './modules/setting/setting.module';
import { ScoreModule } from './modules/score/score.module';
import { ReactionModule } from './modules/reaction/reaction.module';
import { PostModule } from './modules/post/post.module';
import { InspirationModule } from './modules/inspiration/inspiration.module';
import { GradeModule } from './modules/grade/grade.module';
import { DiscussionSetModule } from './modules/discussion-set/discussion-set.module';
import { DiscussionModule } from './modules/discussion/discussion.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SendGridModule } from "@ntegral/nestjs-sendgrid";

@Module({
  imports: [
    UserModule,
    SettingModule,
    ScoreModule,
    ReactionModule,
    PostModule,
    InspirationModule,
    GradeModule,
    DiscussionSetModule,
    DiscussionModule,
    CalendarModule,
    MongooseModule.forRoot(
      process.env.MONGO_CONNECTION_STRING,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true
      }
    ),
    SendGridModule.forRoot({ 
      apiKey: process.env.SENDGRID_KEY
    })
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
