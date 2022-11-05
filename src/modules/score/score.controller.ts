import {
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Model, Types } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IsScoreCreatorGuard } from 'src/auth/guards/userGuards/isScoreCreator.guard';
import { RequesterIsUserGuard } from 'src/auth/guards/userGuards/requesterIsUser.guard';
import { ScoreCreateDTO } from 'src/entities/score/create-score';
import { ScoreEditDTO } from 'src/entities/score/edit-score';
import { Score, ScoreDocument } from 'src/entities/score/score';
import { User } from 'src/entities/user/user';
import SCORE_ERRORS from './score-errors';

@Controller()
export class ScoreController {
  constructor(
    @InjectModel(Score.name) private scoreModel: Model<ScoreDocument>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  @HttpCode(200)
  @Post('users/:userId/score')
  @ApiOperation({
    description: `Request will create a Score. Note that to create an 'auto' score you will need to send posts_made, active_days, comments_received, and/or post_inspirations. You do not need criteria for auto score.
    If you are creating a rubric you will need to send up criteria and do not need to send up the other properties.`,
  })
  @ApiBody({ description: 'The Score to create', type: ScoreCreateDTO })
  @ApiOkResponse({ description: 'Score created successfully' })
  @ApiUnauthorizedResponse({ description: 'The user is not authenticated' })
  @ApiForbiddenResponse({
    description: 'The requester is not the user creating the calendar',
  })
  @ApiTags('Score')
  @UseGuards(JwtAuthGuard, RequesterIsUserGuard)
  async createScore(
    @Param('userId') id: string,
    @Body() score: ScoreCreateDTO,
  ) {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw SCORE_ERRORS.USER_ID_INVALID;
    }
    const user = await this.userModel.findOne({ _id: id });
    if (!user) {
      throw SCORE_ERRORS.USER_NOT_FOUND;
    }

    // Double check all of the scoring adds up to the total score possible
    this.checkScore(score);

    const createdScore = await this.scoreModel.create({
      ...score,
      creatorId: user._id,
    });

    return createdScore._id;
  }

  @Patch('users/:userId/score/:scoreId')
  @ApiOperation({ description: 'This will update a score object' })
  @ApiBody({ description: 'Valid edit for a score', type: ScoreEditDTO })
  @ApiOkResponse({ description: 'Score updated successfully' })
  @ApiUnauthorizedResponse({ description: 'The user is not authenticated' })
  @ApiForbiddenResponse({ description: 'The user is not the score creator' })
  @ApiTags('Score')
  @UseGuards(JwtAuthGuard, IsScoreCreatorGuard)
  async updateScore(
    @Param('userId') id: string,
    @Param('scoreId') scoreId: string,
    @Body() score: ScoreEditDTO,
  ) {
    if (!score) {
      throw SCORE_ERRORS.SCORE_EMPTY;
    }
    //USER ID VALIDATION
    if (!id || !Types.ObjectId.isValid(id)) {
      throw SCORE_ERRORS.USER_ID_INVALID;
    }
    const user = await this.userModel.findOne({ _id: id });
    if (!user) {
      throw SCORE_ERRORS.USER_NOT_FOUND;
    }

    //SCORE ID VALIDATION
    if (!scoreId || !Types.ObjectId.isValid(scoreId)) {
      throw SCORE_ERRORS.SCORE_ID_INVALID;
    }

    const foundScore = await this.scoreModel.findOne({ _id: scoreId }).lean();
    if (!foundScore) {
      throw SCORE_ERRORS.SCORE_NOT_FOUND;
    }

    // Concat the update and check that the score still checks out
    const updatedScore = { ...foundScore, ...score };
    this.checkScore(updatedScore);

    await this.scoreModel.findOneAndUpdate({ _id: foundScore._id }, score);

    return 'Score Updated';
  }

  checkScore(score: any) {
    // Double check all of the scoring adds up to the total score possible
    if (score.type === 'auto') {
      const active_days = score.active_days?.max_points
        ? score.active_days.max_points
        : 0;
      const comments_received = score.comments_received?.max_points
        ? score.comments_received?.max_points
        : 0;
      const post_inspirations = score.post_inspirations?.max_points
        ? score.post_inspirations.max_points
        : 0;
      const posts_made = score.posts_made?.max_points
        ? score.posts_made.max_points
        : 0;
      const totaled =
        active_days + comments_received + post_inspirations + posts_made;
      if (totaled !== score.total) {
        throw SCORE_ERRORS.SCORE_TOTAL_INVALID;
      }
    }
    if (score.type === 'rubric') {
      const totaled = score.criteria.reduce((a, b) => a + b.max_points, 0);
      if (totaled !== score.total) {
        throw SCORE_ERRORS.SCORE_TOTAL_INVALID;
      }
    }
  }
}
