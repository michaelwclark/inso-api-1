import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Calendar } from './entities/calendar/calendar';
import { CalendarCreateDTO } from './entities/calendar/create-calendar';
import { CalendarEditDTO } from './entities/calendar/edit-calendar';
import { DiscussionSetCreateDTO } from './entities/discussion-set/create-discussion-set';
import { DiscussionSetEditDTO } from './entities/discussion-set/edit-discussion-set';
import { DiscussionPost } from './entities/post';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('stuff')
  testStuff(@Body() body: DiscussionSetEditDTO): void {
    console.log(body);
  }
}
