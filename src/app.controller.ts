import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { DiscussionPost } from './entities/post';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('stuff')
  testStuff(@Body() body: any): void {
    console.log(body);
    const wow = new DiscussionPost(body);
    console.log(wow.post);
  }
}
