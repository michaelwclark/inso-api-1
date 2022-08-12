import { Body, Controller, HttpCode, HttpException, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiBody, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Model, Types } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IsScoreCreatorGuard } from 'src/auth/guards/userGuards/isScoreCreator.guard';
import { RequesterIsUserGuard } from 'src/auth/guards/userGuards/requesterIsUser.guard';
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
  @ApiOperation({
    description: 
    `Request will create a Score. Note that to create an 'auto' score you will need to send posts_made, active_days, comments_received, and/or post_inspirations. You do not need criteria for auto score.
    If you are creating a rubric you will need to send up criteria and do not need to send up the other properties.`})
  @ApiBody({description: 'The Score to create', type: ScoreCreateDTO})
  @ApiOkResponse({description: 'Score created successfully'})
  @ApiUnauthorizedResponse({description: 'The user is not authenticated'})
  @ApiForbiddenResponse({ description: "The requester is not the user creating the calendar"})
  @ApiTags('Score')
  @UseGuards(JwtAuthGuard, RequesterIsUserGuard)
  async createScore(
    @Param('userId') id: string,
    @Body() score: ScoreCreateDTO
  ){
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

    // Double check all of the scoring adds up to the total score possible
    this.checkScore(score);

    const createdScore = new this.ScoreModel({...score, creatorId: user._id});
    await createdScore.save();

    return createdScore._id;
  }

  @Patch('users/:userId/score/:scoreId')
  @ApiOperation({ description: 'This will update a score object'})
  @ApiBody({description: 'Valid edit for a score', type: ScoreEditDTO})
  @ApiOkResponse({description: 'Score updated successfully'})
  @ApiUnauthorizedResponse({ description: "The user is not authenticated"})
  @ApiForbiddenResponse({ description: "The user is not the score creator"})
  @ApiTags('Score')
  @UseGuards(JwtAuthGuard, IsScoreCreatorGuard)
  async updateScore(
    @Param('userId') id: string,
    @Param('scoreId') scoreId: string,
    @Body() score: ScoreEditDTO
  ){

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

    const foundScore = await this.ScoreModel.findOne({_id: scoreId}).lean();
    if(!foundScore){
      throw new HttpException("Score does not exist", HttpStatus.NOT_FOUND);
    }

    // Concat the update and check that the score still checks out
    const updatedScore = { ...foundScore, ...score};
    this.checkScore(updatedScore);

    await this.ScoreModel.findOneAndUpdate( {_id: foundScore._id}, score);

    return 'Score Updated';

  }

  checkScore(score: any) {
    // Double check all of the scoring adds up to the total score possible
    if(score.type === 'auto') {
      const active_days = score.active_days?.max_points ? score.active_days.max_points : 0;
      const comments_received = score.comments_received?.max_points ? score.comments_received?.max_points : 0;
      const post_inspirations = score.post_inspirations?.max_points ? score.post_inspirations.max_points : 0;
      const posts_made = score.posts_made?.max_points ? score.posts_made.max_points : 0;
      const totaled = active_days + comments_received + post_inspirations + posts_made;
      if(totaled !== score.total) {
        throw new HttpException("Total score does not add up", HttpStatus.BAD_REQUEST);
      }
    }
    if(score.type === 'rubric') {
      const totaled = score.criteria.reduce((a,b) => a + b.max_points, 0);
      if(totaled !== score.total) {
        throw new HttpException('Total score does not add up', HttpStatus.BAD_REQUEST);
      }
    }
  }
  
 
}
