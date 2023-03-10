import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Discussion,
  DiscussionDocument,
} from 'src/entities/discussion/discussion';
import { DiscussionReadDTO } from 'src/entities/discussion/read-discussion';
import { DiscussionPost, DiscussionPostDocument } from 'src/entities/post/post';
import { GradeDTO } from 'src/entities/grade/create-grade';
import { Setting, SettingDocument } from 'src/entities/setting/setting';
import { Grade, GradeDocument } from 'src/entities/grade/grade';
import * as schedule from 'node-schedule';

@Injectable()
export class GradeService {
  constructor(
    @InjectModel(Discussion.name)
    private discussionModel: Model<DiscussionDocument>,
    @InjectModel(DiscussionPost.name)
    private discussionPostModel: Model<DiscussionPostDocument>,
    @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
    @InjectModel(Grade.name) private gradeModel: Model<GradeDocument>,
  ) {
    // The following code is to reload all discussions for autograding
    this.returnAllDiscussions().then((discussions) => {
      const now = new Date();

      discussions.filter((discussion) => {
        const temp = new DiscussionReadDTO(discussion);
        if (temp.settings.calendar && temp.settings.calendar.close) {
          if (new Date(temp.settings.calendar.close) >= now) {
            const data = {
              id: temp._id,
              closeDate: new Date(temp.settings.calendar.close),
            };
            this.addEventForAutoGrading(data);
          }
        }
      });
    });
  }

  async addEventForAutoGrading(details: any) {
    // needs discussion id and close date

    const discussionId = details.id;
    const closeDate = details.closeDate;

    const discussion = await this.discussionModel
      .findOne({ _id: discussionId })
      .populate('facilitators', ['f_name', 'l_name', 'email', 'username'])
      .populate('poster', ['f_name', 'l_name', 'email', 'username'])
      .populate({
        path: 'settings',
        populate: [
          { path: 'calendar' },
          { path: 'score' },
          { path: 'post_inspirations' },
        ],
      })
      .lean();
    const readDiscussion = new DiscussionReadDTO(discussion);

    const gradingEvent = schedule.scheduleJob(closeDate, async function () {
      for await (const participant of discussion.participants) {
        await this.gradeParticipant(
          new Types.ObjectId(readDiscussion._id),
          new Types.ObjectId(readDiscussion.poster._id),
          new Types.ObjectId(participant.user),
          readDiscussion.settings.scores,
        );
      }
    });

    gradingEvent;
  }

  async gradeDiscussion(discussionId: string) {
    // Retrieve the discussion and make sure it exists and that it is set for autograding
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

    const foundDiscussion = await this.discussionModel
      .findOne({ _id: discussionId })
      .populate('facilitators', ['f_name', 'l_name', 'email', 'username'])
      .populate('poster', ['f_name', 'l_name', 'email', 'username'])
      .populate({
        path: 'settings',
        populate: [
          { path: 'calendar' },
          { path: 'score' },
          { path: 'post_inspirations' },
        ],
      })
      .lean();

    const newDiscussion = new DiscussionReadDTO(foundDiscussion);

    if (!discussion) {
      throw new HttpException(
        `${discussionId} does not exist as a discussion`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (newDiscussion.settings.scores == undefined) {
      throw new HttpException(
        `${discussionId} is missing a rubric`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (newDiscussion.settings.scores.type !== 'auto') {
      throw new HttpException(
        `${discussionId} is not set for autograding`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (discussion.participants.length == 0) {
      throw new HttpException(
        'Discussion has no participants to grade',
        HttpStatus.BAD_REQUEST,
      );
    }

    for await (const participant of discussion.participants) {
      await this.gradeParticipant(
        new Types.ObjectId(newDiscussion._id),
        new Types.ObjectId(newDiscussion.poster._id),
        new Types.ObjectId(participant.user),
        newDiscussion.settings.scores,
      );
    }
  }

  async gradeParticipant(
    discussionId: Types.ObjectId,
    facilitator: Types.ObjectId,
    participantId: Types.ObjectId,
    rubric: any,
  ) {

    const gradeCriteria = {
      posts_made: rubric.posts_made ? rubric.posts_made : null,
      active_days: rubric.active_days ? rubric.active_days : null,
      comments_received: rubric.comments_received
        ? rubric.comments_received
        : null,
      post_inspirations: rubric.post_inspirations
        ? rubric.post_inspirations
        : null,
    };

    const grade = {
      total: 0,
      criteria: [],
      comments: '',
    };

    // Retrieve the users posts in the discussionId and any of there posts and reactions to determine the following
    const posts = [];
    const dbPosts = await this.discussionPostModel.find({
      discussionId: new Types.ObjectId(discussionId),
      draft: false,
      userId: new Types.ObjectId(participantId),
    });

    if (gradeCriteria.posts_made !== null) {
      if (posts.length !== gradeCriteria.posts_made.required) {
        // Determine how many they are off and calculate the grade

        let percentage =
          (dbPosts.length / gradeCriteria.posts_made.required) * 100;
        if (percentage > 100) {
          percentage = 100;
        }

        let tempGrade = 0;
        tempGrade =
          (gradeCriteria.posts_made.max_points / 100) * percentage;

        grade.criteria.push({
          criteria: 'posts made',
          earnedCriteria: dbPosts.length,
          max_points: gradeCriteria.posts_made.max_points,
          earned: tempGrade,
        });

        grade.total = grade.total + tempGrade;
      }
    }

    if (gradeCriteria.active_days !== null) {
      // Determine the number of days that they either posted or made a reaction in the discussion

      const dates = [];
      let activeDates = [];
      dbPosts.forEach((element) => {
        const newDate = element.date.toLocaleDateString('en-US');
        dates.push(newDate);
        activeDates = [...new Set(dates)];
      });

      let percentage =
        (activeDates.length / gradeCriteria.active_days.required) * 100;
      if (percentage > 100) {
        percentage = 100;
      }
      let activeDatesGrade = 0;
      activeDatesGrade =
        (gradeCriteria.active_days.max_points / 100) * percentage;

      grade.criteria.push({
        criteria: 'active days',
        earnedCritera: activeDates.length,
        max_points: gradeCriteria.active_days.max_points,
        earned: activeDatesGrade,
      });

      grade.total = grade.total + activeDatesGrade;
    }

    if (gradeCriteria.comments_received) {
      // Determine if the number of comments received on the first post suffices. If they have multiple posts determine if they have comments

      let commentsToUser = 0;
      const commentsArray = await this.discussionPostModel.find({
        discussionId: new Types.ObjectId(discussionId),
        draft: false,
        comment_for: { $ne: null },
      });

      for await (const element of commentsArray) {
        const tempCom = await this.discussionPostModel.findOne({
          _id: element.comment_for,
        });
        if (new Types.ObjectId(tempCom.userId).equals(participantId)) {
          commentsToUser = commentsToUser + 1;
        }
        break;
      }


      let percentage = 0;
      if (commentsToUser > 0) {
        percentage = (commentsToUser / gradeCriteria.comments_received.required) * 100;
        if (percentage > 100) {
          percentage = 100;
        }
      }

      let commentsGrade = 0;
      commentsGrade =
        (gradeCriteria.comments_received.max_points / 100) * percentage;

      grade.criteria.push({
        criteria: 'comments received',
        earnedCriteria: commentsToUser,
        max_points: gradeCriteria.comments_received.max_points,
        earned: commentsGrade,
      });

      grade.total = grade.total + commentsGrade;
    }

    if (gradeCriteria.post_inspirations) {
      // See if any of the posts used a post inspiration

      if (gradeCriteria.post_inspirations.selected == true) {
        const discussion = await this.discussionModel.findOne({
          _id: discussionId,
        });
        const setting = await this.settingModel.findOne({
          _id: discussion.settings,
        });
        let stopFlag = false;
        if (setting.post_inspirations.length > 0 && dbPosts.length > 0) {
          for (let i = 0; i < dbPosts.length && stopFlag == false; i++) {
            if (Types.ObjectId.isValid(dbPosts[i].post_inspiration)) {
              stopFlag = true;
            } // checks if any of the user's posts to the discussion, actually used an inspiration
          }
        }

        let inspirationsGrade = 0;
        if (stopFlag == true) {
          inspirationsGrade = gradeCriteria.post_inspirations.max_points;
        } // if an inspiration was used on any of the user's posts, full credit is awarded
        grade.criteria.push({
          criteria: 'post inspirations',
          max_points: gradeCriteria.post_inspirations.max_points,
          earned: inspirationsGrade,
        });
        grade.total = grade.total + inspirationsGrade;
      }
    }

    const confirmedGrade = new GradeDTO(grade);

    let max = 0;
    for (let i = 0; i < confirmedGrade.criteria.length; i++) {
      max = max + confirmedGrade.criteria[i].max_points;
    }
    const graded = await this.gradeModel
      .findOne({ discussionId: discussionId, userId: participantId })
      .lean();
    if (!graded) {
      const saveGrade = new this.gradeModel({
        grade: confirmedGrade.total,
        maxScore: max,
        rubric: confirmedGrade.criteria,
        discussionId: discussionId,
        userId: participantId,
        facilitator: facilitator,
        comment: confirmedGrade.comments,
      });
      await saveGrade.save();
    } else {
      await this.gradeModel.findOneAndUpdate(
        { discussionId: discussionId, userId: participantId },
        {
          grade: confirmedGrade.total,
          maxScore: max,
          rubric: confirmedGrade.criteria,
          facilitator: facilitator,
          comment: confirmedGrade.comments,
        },
      );
    }
  }

  async returnAllDiscussions() {
    const discussions = await this.discussionModel
      .find({})
      .populate('facilitators', ['f_name', 'l_name', 'email', 'username'])
      .populate('poster', ['f_name', 'l_name', 'email', 'username'])
      .populate({
        path: 'settings',
        populate: [
          { path: 'calendar' },
          { path: 'score' },
          { path: 'post_inspirations' },
        ],
      })
      .lean();
    return discussions;
  }
}
