import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Score, ScoreDocument } from 'src/entities/score/score';


@Controller()
export class ScoreController {
  constructor(
    @InjectModel(Score.name) private ScoreModel: Model<ScoreDocument>
  ) {}

  @Get('score')
  getHello(): string {
    return 'score'
  }

  @Post('users/:userId/score')
  async createScore(@Param('userId') id: string, @Body() score: Score){

  }
  
 


}