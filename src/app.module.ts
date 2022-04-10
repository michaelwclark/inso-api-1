import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CalendarModule } from './calendar/calendar.module';
import { DiscussionModule } from './discussion/discussion.module';
import { GradeModule } from './grade/grade.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [CalendarModule, DiscussionModule, GradeModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
