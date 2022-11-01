import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Model, Types } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IsDiscussionFacilitatorGuard } from 'src/auth/guards/userGuards/isDiscussionFacilitator.guard';
import {
  Discussion,
  DiscussionDocument,
} from 'src/entities/discussion/discussion';
import { DiscussionReadDTO } from 'src/entities/discussion/read-discussion';
import { GradeDTO } from 'src/entities/grade/create-grade';
import { Grade, GradeDocument } from 'src/entities/grade/grade';
import { GradeService } from './grade.service';
import { NotificationService } from 'src/modules/notification/notification.service';
import environment from 'src/environment';

@Controller()
export class GradeController {
  constructor(
    @InjectModel(Discussion.name)
    private discussionModel: Model<DiscussionDocument>,
    @InjectModel(Grade.name) private gradeModel: Model<GradeDocument>,
    private gradeService: GradeService,
    private notificationservice: NotificationService,
  ) {}

  @Patch('/discussions/:discussionId/participants/:participantId/grade')
  @ApiBody({ type: GradeDTO })
  @UseGuards(JwtAuthGuard, IsDiscussionFacilitatorGuard)
  @ApiTags('Grade')
  @ApiOperation({ description: 'Updates a grade for a user' })
  async createGradeForParticipant(
    @Param('discussionId') discussionId: string,
    @Param('participantId') participantId: string,
    @Body() grade: GradeDTO,
    @Req() req,
  ) {
    // Check that the discussion exists and the participant is actually a participant
    const discussion = await this.discussionModel
      .findOne({ _id: discussionId })
      .populate({
        path: 'settings',
        populate: [
          { path: 'calendar' },
          { path: 'score' },
          { path: 'post_inspirations' },
        ],
      })
      .lean();
    if (!discussion) {
      throw new HttpException(
        'Discussion does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    const newDiscussion = new DiscussionReadDTO(discussion);

    // Make sure the participant is apart of the discussion and not already graded
    const participant = discussion.participants.filter((part) => {
      if (part.user.toString() === participantId) {
        return part;
      }
    })[0];
    // TODO: above will throw unhandled exception if participant is not found
    if (!participant) {
      throw new HttpException(
        "Participant is not a part of this discussion and can't receive a grade",
        HttpStatus.BAD_REQUEST,
      );
    }

    const confirmedGrade = new GradeDTO(grade);
    if (
      confirmedGrade.criteria.length !==
      newDiscussion.settings.scores.criteria.length
    ) {
      throw new HttpException(
        'Criteria for score not all included',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Generate the grade, put it in the database, and
    const gradeModel = {
      discussionId: discussion._id,
      userId: new Types.ObjectId(participantId),
      grade: confirmedGrade.total,
      maxScore: newDiscussion.settings.scores.total,
      rubric: confirmedGrade.criteria,
      facilitator: req.user.userId,
      comment: confirmedGrade.comments,
    };

    await this.notificationservice.createNotification(
      participant.user,
      req.user.userId,
      {
        header: `<h1 className="notification-header">Recent grade post <span className="username">@${participant.user}</span> in <a className="discussion-link" href="${environment.DISCUSSION_REDIRECT}?id=${discussionId}">${participant.grade}</a></h1>`,
        text: `${this.notificationservice}`,
        type: 'grade',
      },
    );
    if (participant.grade === null) {
      const newGrade = new this.gradeModel(gradeModel);
      const gradeId = await newGrade.save();
      return await this.discussionModel.findOneAndUpdate(
        {
          _id: discussionId,
          'participants.user': new Types.ObjectId(participantId),
        },
        { $set: { 'participants.$.grade': gradeId._id } },
      );
    } else {
      return await this.gradeModel.findOneAndUpdate(
        { _id: participant.grade },
        gradeModel,
      );
    }
  }

  /**
   * This route is only for the autograding of a discussion 1 minute after the discussion closes
   */
  @Patch('/discussion/:discussionId/participants/autograde')
  @ApiTags('Grade')
  @ApiOperation({ description: 'Autogrades a discussion' })
  @UseGuards()
  async autoGradeParticipants(@Param('discussionId') discussionId: string) {
    if (Types.ObjectId.isValid(discussionId)) {
      return await this.gradeService.gradeDiscussion(discussionId);
    } else {
      throw new HttpException(
        'DiscussionId is not valid',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
