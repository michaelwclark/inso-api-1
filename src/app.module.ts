import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';
import { ScoreModule } from './modules/score/score.module';
import { ReactionModule } from './modules/reaction/reaction.module';
import { PostModule } from './modules/post/post.module';
import { InspirationModule } from './modules/inspiration/inspiration.module';
import { GradeModule } from './modules/grade/grade.module';
import { DiscussionSetModule } from './modules/discussion-set/discussion-set.module';
import { DiscussionModule } from './modules/discussion/discussion.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppService } from './app.service';
import { GoogleStrategy } from './auth/guards/google.strategy';
import { UploadModule } from './modules/upload/upload.module';
import { MilestoneModule } from './modules/milestone/milestone.module';
import { NotificationModule } from './modules/notification/notification.module';
import environment from 'src/environment';
@Module({
  imports: [
    AuthModule,
    AnalyticsModule,
    UserModule,
    ScoreModule,
    ReactionModule,
    PostModule,
    InspirationModule,
    GradeModule,
    DiscussionSetModule,
    DiscussionModule,
    CalendarModule,
    PostModule,
    UploadModule,
    MilestoneModule,
    NotificationModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(environment.MONGO_CONNECTION_STRING, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }),
    SendGridModule.forRoot({
      apiKey: environment.SENDGRID_KEY,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    AppService,
    GoogleStrategy,
  ],
})
export class AppModule {}
