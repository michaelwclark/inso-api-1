import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Model, Types } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IsDiscussionFacilitatorGuard } from 'src/auth/guards/userGuards/isDiscussionFacilitator.guard';
import { Discussion, DiscussionDocument } from 'src/entities/discussion/discussion';
import { DiscussionReadDTO } from 'src/entities/discussion/read-discussion';
import { CreateGrade } from 'src/entities/grade/create-grade';
import { Grade, GradeDocument } from 'src/entities/grade/grade';


@Controller()
export class GradeController {
  constructor(
    @InjectModel(Discussion.name) private discussionModel: Model<DiscussionDocument>,
    @InjectModel(Grade.name) private gradeModel: Model<GradeDocument>
  ) {}

  @Post('/discussions/:discussionId/participants/:participantId/grade')
  @UseGuards(JwtAuthGuard)
  async createGradeForParticipant(
    @Param('discussionId') discussionId: string,
    @Param('participantId') participantId: string,
    @Body() grade: CreateGrade,
    @Req() req
  ) {
    // Check that the discussion exists and the participant is actually a participant
    const discussion = await this.discussionModel.findOne(
        { _id: discussionId}
      ).populate({ path: 'settings', populate: [{ path: 'calendar'}, { path: 'score'}, { path: 'post_inspirations'}]}).lean();
    if(!discussion) {
      throw new HttpException('Discussion does not exist', HttpStatus.NOT_FOUND)
    }
    const newDiscussion = new DiscussionReadDTO( discussion );
    if(newDiscussion.settings.scores.type === 'auto') {
      throw new HttpException('Cannot create a grade for an autograded discussion. Please use PATCH /discussions/:discussionId/participants/:participantId/grade to update grade', HttpStatus.BAD_REQUEST);
    }

    // Make sure the participant is apart of the discussion
    const participant = discussion.participants.map(part => {
      if(part.user === new Types.ObjectId(participantId)) {
        return part;
      }
    });
    if(!participant) {
      throw new HttpException('Participant is not a part of this discussion and can\'t receive a grade', HttpStatus.BAD_REQUEST);
    }

    const confirmedGrade = new CreateGrade(grade);
    if(confirmedGrade.criteria.length !== newDiscussion.settings.scores.criteria.length) {
      throw new HttpException('Criteria for score not all included', HttpStatus.BAD_REQUEST)
    }

    const gradeModel = {
      discussionId: discussion._id,
      userId: new Types.ObjectId(participantId),
      grade: confirmedGrade.total,
      maxScore: newDiscussion.settings.scores.total,
      rubric: confirmedGrade.criteria,
      facilitator: req.user.userId,
      comment: confirmedGrade.comments
    }

    const newGrade = new this.gradeModel(gradeModel);
    const gradeId = await newGrade.save();

    return await this.discussionModel.findOneAndUpdate({ _id: discussionId, 'participants.user': new Types.ObjectId(participantId)}, { $set: { 'participants.$.grade': gradeId._id}});
  }

  @Patch('/discussions/:discussionId/participants/:participantId/grade')
  @UseGuards(JwtAuthGuard, IsDiscussionFacilitatorGuard)
  async updateGradeForParticipant() {

  }

  /**
   * This route is only for the autograding of a discussion 1 minute after the discussion closes 
   */
  @Patch('/discussion/:discussionId/participants/autograde')
  @UseGuards()
  async autoGradeParticipants() {

  }

}