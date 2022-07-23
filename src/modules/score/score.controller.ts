import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Model, Types } from 'mongoose';
import { ScoreCreateDTO } from 'src/entities/score/create-score';
import { ScoreEditDTO } from 'src/entities/score/edit-score';
import { Score, ScoreDocument } from 'src/entities/score/score';
import { User } from 'src/entities/user/user';



@Controller()
export class ScoreController {
  constructor(
    @InjectModel(Score.name) private ScoreModel: Model<ScoreDocument>,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  @HttpCode(200)
  @Post('users/:userId/score')
  @ApiOperation({description: 'Request will create a Score'})
  @ApiBody({description: '', type: ScoreCreateDTO})
  @ApiOkResponse({description: 'Score created successfully'})
  @ApiTags('Score')
  async createScore(@Param('userId') id: string, @Body() score: ScoreCreateDTO){

    if(id === undefined){
      throw new HttpException("User id is undefined", HttpStatus.BAD_REQUEST);
    }
    if(id === null){
      throw new HttpException("No user id provided", HttpStatus.BAD_REQUEST);
    }
    if(!Types.ObjectId.isValid(id)){
      throw new HttpException("User id is not valid", HttpStatus.BAD_REQUEST);
    }
    const user = await this.userModel.findOne({_id: id});
    if(!user) {
      throw new HttpException("User does not exist", HttpStatus.BAD_REQUEST);
    }

    if(score.rubric.criteria.length == 0){
      throw new HttpException("Array length for criteria cannot be 0", HttpStatus.BAD_REQUEST);
    }

    const createdScore = new this.ScoreModel({...score, creator: id});
    await createdScore.save();

    return createdScore._id;
  }

  @Patch('users/:userId/score/:scoreId')
  @ApiOperation({ description: 'This will update a score object'})
  @ApiBody({description: '', type: ScoreEditDTO})
  @ApiOkResponse({description: 'Score updated successfully'})
  @ApiTags('Score')
  async updateScore(@Param('userId') id: string, @Param('scoreId') scoreId: string, @Body() score: ScoreEditDTO){

    if(score === null){
      throw new HttpException("Score object is empty", HttpStatus.BAD_REQUEST);
    }
    //USER ID VALIDATION
    if(id === undefined){
      throw new HttpException("User id is undefined", HttpStatus.BAD_REQUEST);
    }
    if(id === null){
      throw new HttpException("No user id provided", HttpStatus.BAD_REQUEST);
    }
    if(!Types.ObjectId.isValid(id)){
      throw new HttpException("User id is not valid", HttpStatus.BAD_REQUEST);
    }
    const user = await this.userModel.findOne({_id: id});
    if(!user) {
      throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
    }

    //SCORE ID VALIDATION
    if(scoreId === undefined){
      throw new HttpException("Score id is undefined", HttpStatus.BAD_REQUEST);
    }
    if(scoreId === null){
      throw new HttpException("No score id provided", HttpStatus.BAD_REQUEST);
    }
    if(!Types.ObjectId.isValid(scoreId)){
      throw new HttpException("Score id is not valid", HttpStatus.BAD_REQUEST);
    }

    if(score.rubric.criteria.length == 0){
      throw new HttpException("Array length for criteria cannot be 0", HttpStatus.BAD_REQUEST);
    }

    const foundScore = await this.ScoreModel.findOne({_id: scoreId});
    if(!foundScore){
      throw new HttpException("Score does not exist", HttpStatus.NOT_FOUND);
    }

    if(!score.creatorId.equals(id)){
      throw new HttpException("Parameter id for user and creator id in body do not match", HttpStatus.FORBIDDEN);
    }

    await foundScore.updateOne(score);

    return 'Score Updated';

  }
  
 
}