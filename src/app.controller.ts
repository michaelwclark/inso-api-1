import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { GradeService } from './modules/grade/grade.service';

@Controller()
export class AppController {
  constructor(
    private appService: AppService,
    private gradeService: GradeService
  ) {}

  @Get()
  async getHello(): Promise<string> {
    await this.gradeService.addEventForAutoGrading("ow");
    return 'Welcome to the Inso API! UPDATED'
  }
}
