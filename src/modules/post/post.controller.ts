import { Controller, Get } from '@nestjs/common';


@Controller()
export class PostController {
  constructor() {}

  @Get('post')
  getHello(): string {
    return 'post'
  }
}