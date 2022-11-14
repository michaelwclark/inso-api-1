import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Model, Types, HydratedDocument } from 'mongoose';
import { DiscussionCreateDTO } from 'src/entities/discussion/create-discussion';
import {
  Discussion,
  DiscussionDocument,
  DiscussionSchema,
} from 'src/entities/discussion/discussion';
import { DiscussionEditDTO } from 'src/entities/discussion/edit-discussion';
import { DiscussionReadDTO } from 'src/entities/discussion/read-discussion';
import {
  Inspiration,
  InspirationDocument,
} from 'src/entities/inspiration/inspiration';
import { Score, ScoreDocument } from 'src/entities/score/score';
import { SettingsCreateDTO } from 'src/entities/setting/create-setting';
import { Setting, SettingDocument } from 'src/entities/setting/setting';
import { getUniqueInsoCode } from '../shared/generateInsoCode';
import { DiscussionPost, DiscussionPostDocument } from 'src/entities/post/post';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User, UserDocument } from 'src/entities/user/user';
import { Calendar, CalendarDocument } from 'src/entities/calendar/calendar';
import { BulkReadDiscussionDTO } from 'src/entities/discussion/bulk-read-discussion';
import { IsDiscussionCreatorGuard } from 'src/auth/guards/userGuards/isDiscussionCreator.guard';
import { IsDiscussionFacilitatorGuard } from 'src/auth/guards/userGuards/isDiscussionFacilitator.guard';
import { IsDiscussionMemberGuard } from 'src/auth/guards/userGuards/isDiscussionMember.guard';
import { Reaction, ReactionDocument } from 'src/entities/reaction/reaction';
import { Grade, GradeDocument } from 'src/entities/grade/grade';
import { DiscussionTagCreateDTO } from 'src/entities/discussion/tag/create-tag';
import { MilestoneService } from '../milestone/milestone.service';
import { DiscussionType } from 'src/entities/discussionType/discussion-type';
import { removeStopwords } from 'stopword';
import { count } from 'count-array-values';
import DISCUSSION_ERRORS from './discussion-errors';

@Controller()
export class DiscussionController {
  constructor(
    @InjectModel(Discussion.name)
    private discussionModel: Model<DiscussionDocument>,
    @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
    @InjectModel(Score.name) private scoreModel: Model<ScoreDocument>,
    @InjectModel(Inspiration.name)
    private post_inspirationModel: Model<InspirationDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Calendar.name) private calendarModel: Model<CalendarDocument>,

    @InjectModel(DiscussionPost.name)
    private postModel: Model<DiscussionPostDocument>,
    @InjectModel(Reaction.name) private reactionModel: Model<ReactionDocument>,
    @InjectModel(Grade.name) private gradeModel: Model<GradeDocument>,
    @InjectModel(DiscussionType.name)
    private discussionTypeModel: Model<DiscussionType>,
    private milestoneService: MilestoneService,
  ) {
    DiscussionSchema.index(
      { insoCode: 'text', name: 'text' },
      { unique: false },
    );
  }

  @Post('discussion')
  @ApiOperation({ description: 'Creates a discussion' })
  @ApiBody({ description: '', type: DiscussionCreateDTO })
  @ApiOkResponse({ description: 'Discussion created!' })
  @ApiBadRequestResponse({
    description: 'The discussion is missing a name, poster, or facilitators',
  })
  @ApiUnauthorizedResponse({
    description: 'The user does not have permission to create a discussion',
  })
  @ApiNotFoundResponse({
    description: 'The poster or one of the facilitators was not found',
  })
  @ApiTags('Discussion')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createDiscussion(
    @Body() discussion: DiscussionCreateDTO,
    @Request() req,
  ): Promise<HydratedDocument<Discussion>> {
    // Check that user exists in DB
    const user = await this.userModel.findOne({ _id: discussion.poster });
    if (!user) {
      throw DISCUSSION_ERRORS.USER_NOT_FOUND;
    }

    // Compare poster to user in request from JWT for authorization
    const auth = await this.userModel.findOne({ username: req.user.username });
    if (auth._id.toString() !== discussion.poster.toString()) {
      throw DISCUSSION_ERRORS.DISCUSSION_POSTER_MISMATCH;
    }

    // Add the poster to the facilitators
    if (discussion.facilitators === undefined) {
      discussion.facilitators = [];
    }
    discussion.facilitators.push(discussion.poster);
    // Filter out any duplicate Ids
    discussion.facilitators = discussion.facilitators.filter((c, index) => {
      return discussion.facilitators.indexOf(c) === index;
    });

    // Verify that all facilitators exist
    for await (const user of discussion.facilitators) {
      const found = await this.userModel.exists({ _id: user });
      if (!found) {
        throw DISCUSSION_ERRORS.FACILITATOR_NOT_FOUND;
      }
    }

    // Check that the code is not active in the database
    const code = await getUniqueInsoCode(this.discussionModel, 5);

    // Get ALL inspirations for the discussion settings
    const inspirations = await this.post_inspirationModel.find().lean();
    const inspirationIds = inspirations.map((inspo) => {
      return inspo._id;
    });

    // Create Settings for Discussion
    const setting = await this.settingModel.create({
      post_inspirations: inspirationIds,
      userId: discussion.poster,
    });

    // Create Discussion
    const createdDiscussion = new this.discussionModel({
      ...discussion,
      poster: new Types.ObjectId(discussion.poster),
      insoCode: code,
      settings: setting._id,
    });

    // Get or Create Milestone for User
    const discussionMilestone = this.milestoneService.getMilestoneForUser(
      user._id,
      'Discussion Created',
    );
    if (!discussionMilestone) {
      await this.milestoneService.createMilestoneForUser(
        user._id,
        'discussion',
        'Discussion Created',
        {
          discussionId: new Types.ObjectId(createdDiscussion._id),
          postId: null,
          date: new Date(),
        },
      );
    }
    return await createdDiscussion.save();
  }

  @Patch('discussion/:discussionId/metadata')
  @ApiOperation({ description: 'Update the metadata for the discussion' })
  @ApiBody({ description: '', type: DiscussionEditDTO })
  @ApiParam({ name: '', description: '' })
  @ApiOkResponse({ description: '' })
  @ApiBadRequestResponse({ description: '' })
  @ApiUnauthorizedResponse({ description: '' })
  @ApiNotFoundResponse({ description: '' })
  @ApiTags('Discussion')
  @UseGuards(JwtAuthGuard, IsDiscussionCreatorGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateDiscussionMetadata(
    @Param('discussionId') discussionId: string,
    @Body() discussion: DiscussionEditDTO,
  ): Promise<HydratedDocument<Discussion>> {
    // Check that discussion exists
    const found = await this.discussionModel.findOne({ _id: discussionId });
    if (!found) {
      throw DISCUSSION_ERRORS.DISCUSSION_NOT_FOUND;
    }

    // If there are new facilitators verify they exist and push them into the existing array
    if (discussion.facilitators) {
      for await (const user of discussion.facilitators) {
        const found = await this.userModel.findOne({ _id: user });
        if (!found) {
          throw DISCUSSION_ERRORS.FACILITATOR_NOT_FOUND;
        }
      }
      // Filter out any duplicate Ids
      discussion.facilitators = discussion.facilitators.filter((c, index) => {
        return discussion.facilitators.indexOf(c) === index;
      });
    }
    // Does not allow adding participants through this route
    if (
      discussion.participants != undefined &&
      JSON.stringify(discussion.participants) !=
      JSON.stringify(found.participants)
    ) {
      throw DISCUSSION_ERRORS.CAN_NOT_EDIT_PARTICIPANTS;
    }
    // Update the discussion and return the new value
    return await this.discussionModel.findOneAndUpdate(
      { _id: discussionId },
      discussion,
      { new: true },
    );
  }

  @Get('discussion/:discussionId')
  @ApiOperation({ description: 'Update the metadata for the discussion' })
  @ApiParam({ name: 'discussionId', description: 'The id of the discussion' })
  @ApiOkResponse({ description: 'Discussions' })
  @ApiBadRequestResponse({ description: 'The discussion Id is not valid' })
  @ApiUnauthorizedResponse({ description: '' })
  @ApiNotFoundResponse({ description: 'The discussion was not found' })
  @ApiTags('Discussion')
  @UseGuards(JwtAuthGuard, IsDiscussionMemberGuard)
  async getDiscussion(
    @Param('discussionId') discussionId: string,
  ): Promise<DiscussionReadDTO> {
    if (!Types.ObjectId.isValid(discussionId)) {
      throw DISCUSSION_ERRORS.DISCUSSION_ID_INVALID;
    }
    const discussion = await this.discussionModel
      .findOne({ _id: discussionId })
      .populate('facilitators', [
        'f_name',
        'l_name',
        'email',
        'username',
        'profilePicture',
      ])
      .populate('poster', [
        'f_name',
        'l_name',
        'email',
        'username',
        'profilePicture',
      ])
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
      throw DISCUSSION_ERRORS.DISCUSSION_NOT_FOUND;
    }

    const participants = [];
    for await (const participant of discussion.participants) {
      const part = await this.userModel
        .findOne({ _id: participant.user })
        .lean();
      const grade = await this.gradeModel
        .findOne({ discussionId: discussion._id, userId: participant.user })
        .lean();
      participants.push({ ...part, muted: participant.muted, grade: grade });
    }

    // Get posts
    const dbPosts = await this.postModel
      .find({
        discussionId: new Types.ObjectId(discussion._id),
        draft: false,
        comment_for: null,
      })
      .populate('userId', [
        'f_name',
        'l_name',
        'email',
        'username',
        'profilePicture',
      ])
      .sort({ date: -1 })
      .lean();

    const posts = [];
    for await (const post of dbPosts) {
      const postWithComments = await this.getPostsAndComments(post);
      posts.push(postWithComments);
    }

    // Add Tags for the discussion
    const tagsArray = await this.getTags(
      posts,
      discussion.tags ? discussion.tags : [],
    );

    const discussionRead = new DiscussionReadDTO({
      ...discussion,
      participants: participants,
      posts: posts,
      tags: tagsArray,
    });

    return discussionRead;
  }

  @Get('discussions/types')
  @ApiOperation({ description: 'Get valid types for a discussion' })
  @ApiOkResponse({ type: DiscussionType })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiTags('Discussion')
  @UseGuards(JwtAuthGuard)
  async getDiscussionTypes() {
    return await this.discussionTypeModel.find().lean();
  }

  @Post('discussion/:discussionId/archive')
  @ApiOperation({ description: 'Archive a discussion' })
  @ApiOkResponse({ description: 'Newly archived discussion' })
  @ApiBadRequestResponse({ description: 'The discussionId is not valid' })
  @ApiUnauthorizedResponse({ description: '' })
  @ApiNotFoundResponse({
    description: 'The discussion to be archived does not exist',
  })
  @ApiTags('Discussion')
  @UseGuards(JwtAuthGuard, IsDiscussionCreatorGuard)
  async archiveDiscussion(
    @Param('discussionId') discussionId: string,
  ): Promise<HydratedDocument<Discussion>> {
    if (!Types.ObjectId.isValid(discussionId)) {
      throw DISCUSSION_ERRORS.DISCUSSION_ID_INVALID;
    }
    const archivedDate = new Date();
    return await this.discussionModel.findOneAndUpdate(
      { _id: discussionId },
      { archived: archivedDate },
      { new: true },
    );
  }

  @Post('discussion/:discussionId/duplicate')
  @ApiOperation({ description: 'Duplicate a discussion with all settings' })
  @ApiOkResponse({ description: 'Discussions' })
  @ApiBadRequestResponse({ description: 'The discussionId is not valid' })
  @ApiUnauthorizedResponse({ description: '' })
  @ApiNotFoundResponse({
    description: 'The discussion to be archived does not exist',
  })
  @ApiTags('Discussion')
  @UseGuards(JwtAuthGuard, IsDiscussionFacilitatorGuard)
  async duplicateDiscussion(
    @Param('discussionId') discussionId: string,
  ): Promise<HydratedDocument<Discussion>> {
    if (!Types.ObjectId.isValid(discussionId)) {
      throw DISCUSSION_ERRORS.DISCUSSION_ID_INVALID;
    }
    const discussion = await this.discussionModel.findOne({
      _id: discussionId,
    });
    if (!discussion) {
      throw DISCUSSION_ERRORS.DISCUSSION_NOT_FOUND;
    }
    const settings = await this.settingModel.findOne({
      _id: discussion.settings,
    });

    //Duplicate the score
    const score = await this.scoreModel.findOne({ _id: settings.score });
    if (score) {
      delete score._id;
    }
    const newScore = new this.scoreModel(score);
    const newScoreId = await newScore.save();

    // duplicate the settings
    // calendar is set to null because the calendar needs to be set
    delete settings._id;
    const newSetting = new this.settingModel({
      userId: settings.userId,
      starter_prompt: settings.starter_prompt,
      post_inspirations: settings.post_inspirations,
      score: newScoreId._id,
      calendar: null,
    });
    const settingId = await newSetting.save();

    // duplicate a discussion
    const code = await getUniqueInsoCode(this.discussionModel, 5);
    const createdDiscussion = new this.discussionModel({
      name: discussion.name,
      facilitators: discussion.facilitators,
      insoCode: code,
      settings: settingId._id,
      poster: discussion.poster,
    });
    return await createdDiscussion.save();
  }

  @Get('users/:userId/discussions')
  @ApiOperation({
    description: 'Gets discussions for a user from the database',
  })
  @ApiOkResponse({ description: 'Discussions' })
  @ApiBadRequestResponse({ description: '' })
  @ApiUnauthorizedResponse({ description: '' })
  @ApiNotFoundResponse({ description: '' })
  @ApiQuery({
    name: 'participant',
    required: false,
    description: 'Return discussions where user is a participant',
  })
  @ApiQuery({
    name: 'facilitator',
    required: false,
    description: 'Return discussions where user is a facilitator',
  })
  @ApiQuery({
    name: 'text',
    required: false,
    description: 'queries for inso code or keyword',
  })
  @ApiQuery({
    name: 'archived',
    required: false,
    description: 'Return archived discussions or not',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    description: 'The sort value of the created date',
  })
  @ApiQuery({
    name: 'closing',
    required: false,
    description: 'The sort value of the closing date',
  })
  @ApiTags('Discussion')
  @UseGuards(JwtAuthGuard)
  async getDiscussions(
    @Param('userId') userId: string,
    @Query('participant') participant: string,
    @Query('facilitator') facilitator: string,
    @Request() req,
    @Query('archived') archived: string,
    @Query('sort') sort: string,
    @Query('text') query: any,
  ): Promise<any[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw DISCUSSION_ERRORS.USER_ID_INVALID;
    }

    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw DISCUSSION_ERRORS.USER_NOT_FOUND;
    }

    if (req.user.userId != userId) {
      throw DISCUSSION_ERRORS.USER_ID_AUTHENTICATION_MISMATCH;
    }

    // Add search for inso code and text
    const aggregation = [];
    if (query !== undefined) {
      // Lookup text queries and such
      aggregation.push({
        $match: {
          $text: { $search: query },
        },
      });
    }
    if (participant === undefined && facilitator === undefined) {
      aggregation.push({
        $match: {
          $or: [
            { 'participants.user': new Types.ObjectId(userId) },
            { facilitators: new Types.ObjectId(userId) },
          ],
        },
      });
    }
    if (participant === 'true') {
      aggregation.push({
        $match: { 'participants.user': new Types.ObjectId(userId) },
      });
    }
    if (facilitator === 'true') {
      aggregation.push({
        $match: { facilitators: new Types.ObjectId(userId) },
      });
    }
    if (archived !== undefined) {
      if (archived === 'false') {
        aggregation.push({ $match: { archived: null } });
      } else if (archived === 'true') {
        aggregation.push({ $match: { archived: { $ne: null } } });
      }
    }
    aggregation.push({
      $lookup: {
        from: 'settings',
        localField: 'settings',
        foreignField: '_id',
        as: 'settings',
      },
    });
    if (sort !== undefined) {
      aggregation.push({ $sort: { created: parseInt(sort) } });
    } else {
      aggregation.push({ $sort: { created: -1 } });
    }
    const discussions = await this.discussionModel.aggregate(aggregation);

    const returnDiscussions = [];
    if (discussions.length > 0) {
      for await (const discuss of discussions) {
        discuss.poster = await this.userModel.findOne({ _id: discuss.poster });
        returnDiscussions.push(new BulkReadDiscussionDTO(discuss));
      }
    }
    return returnDiscussions;
  }

  @Get('users/:userId/discussions/statistics')
  @ApiOperation({
    description:
      'Get statistics for all discussions a user is associated with or a specific discussion',
  })
  @ApiQuery({
    name: 'id',
    required: false,
    description: 'the id of a particular discussion or discussions',
  })
  @UseGuards(JwtAuthGuard)
  async getDiscussionStats(
    @Param('userId') userId: string,
    @Query('id') discussionId: string | string[],
    @Request() req,
  ) {
    if (!Types.ObjectId.isValid(userId)) {
      throw DISCUSSION_ERRORS.USER_ID_INVALID;
    }

    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw DISCUSSION_ERRORS.USER_NOT_FOUND;
    }

    if (req.user.userId != userId) {
      throw DISCUSSION_ERRORS.USER_ID_AUTHENTICATION_MISMATCH;
    }

    const aggregation = [];
    // If there isn't a discussionId passed in get all discussion a user is a part of
    if (!discussionId) {
      aggregation.push({
        $match: {
          $or: [
            { 'participants.user': new Types.ObjectId(userId) },
            { facilitators: new Types.ObjectId(userId) },
          ],
        },
      });
    } else if (typeof discussionId === 'object') {
      aggregation.push({ $match: { _id: { $in: discussionId } } });
    } else {
      aggregation.push({ $match: { _id: discussionId } });
    }

    // const discussions = await this.discussionModel.aggregate(aggregation);

    // const stats = {
    //   posts: 0,
    //   averageWordCount: 0,
    //   facilitatorPosts: 0,
    //   longestThread: {
    //     count: 0,
    //     participants: [],
    //   },
    // };

    // return stats
    // If there is a discussionId, get the discussion or discussions
  }

  @Patch('discussion/:discussionId/settings')
  @ApiOperation({ description: 'Update the discussion settings' })
  @ApiBody({ description: '', type: SettingsCreateDTO })
  @ApiParam({ name: '', description: '' })
  @ApiOkResponse({ description: '' })
  @ApiBadRequestResponse({ description: '' })
  @ApiUnauthorizedResponse({ description: '' })
  @ApiNotFoundResponse({ description: '' })
  @ApiTags('Discussion')
  @UseGuards(JwtAuthGuard, IsDiscussionCreatorGuard)
  async updateDiscussionSettings(
    @Body() setting: SettingsCreateDTO,
    @Param('discussionId') discussionId: string,
  ): Promise<HydratedDocument<Setting>> {
    //check discussionId is valid
    if (!Types.ObjectId.isValid(discussionId)) {
      throw DISCUSSION_ERRORS.DISCUSSION_ID_INVALID;
    }

    const found = await this.discussionModel.findOne({
      _id: new Types.ObjectId(discussionId),
    });
    if (!found) {
      throw DISCUSSION_ERRORS.DISCUSSION_NOT_FOUND;
    }

    if (setting.score) {
      const score = await this.scoreModel.findOne({
        _id: new Types.ObjectId(setting.score),
      });
      if (!score) {
        throw DISCUSSION_ERRORS.SCORE_NOT_FOUND;
      }
      setting.score = new Types.ObjectId(setting.score);
    }

    if (setting.calendar) {
      const calendar = await this.calendarModel.findOne({
        _id: new Types.ObjectId(setting.calendar),
      });
      if (!calendar) {
        throw DISCUSSION_ERRORS.CALENDAR_NOT_FOUND;
      }
      setting.calendar = new Types.ObjectId(setting.calendar);
    }

    //Loop through the setting.post_inspiration
    if (setting.post_inspirations) {
      const objectIds = [];
      for await (const post_inspiration of setting.post_inspirations) {
        const found = await this.post_inspirationModel.findOne({
          _id: [new Types.ObjectId(post_inspiration)],
        });
        if (!found) {
          throw DISCUSSION_ERRORS.POST_INSPIRATION_NOT_FOUND;
        }
        objectIds.push(new Types.ObjectId(post_inspiration));
      }
      setting.post_inspirations = objectIds;
    }
    return await this.settingModel.findOneAndUpdate(
      { _id: new Types.ObjectId(found.settings) },
      setting,
      { new: true, upsert: true },
    );
  }

  @Patch('/users/:userId/discussions/:insoCode/join')
  @ApiOperation({
    description: 'Add the user as a participant on the discussion',
  })
  @ApiOkResponse({ description: 'Participant added' })
  @ApiBadRequestResponse({ description: 'UserId is not valid' })
  @ApiUnauthorizedResponse({ description: '' })
  @ApiNotFoundResponse({ description: 'UserId not found in the discussion' })
  @ApiTags('Discussion')
  @UseGuards(JwtAuthGuard)
  async joinDiscussion(
    @Param('userId') userId: string,
    @Param('insoCode') insoCode: string,
  ): Promise<HydratedDocument<Discussion>> {
    if (insoCode.length !== 5) {
      throw DISCUSSION_ERRORS.INSO_CODE_INVALID;
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw DISCUSSION_ERRORS.USER_ID_INVALID;
    }

    //check for user
    const findUser = await this.userModel.findOne({
      _id: new Types.ObjectId(userId),
    });
    if (!findUser) {
      throw DISCUSSION_ERRORS.USER_NOT_FOUND;
    }

    //check for discusionId
    const found = await this.discussionModel.findOne({ insoCode: insoCode });
    if (!found) {
      throw DISCUSSION_ERRORS.DISCUSSION_NOT_FOUND;
    }

    // Add the participants to the discussion
    const queryId = new Types.ObjectId(userId);
    const foundParticipant = await this.discussionModel.findOne({
      insoCode: insoCode,
      'participants.user': queryId,
    });
    if (foundParticipant) {
      throw DISCUSSION_ERRORS.USER_ALREADY_IN_DISCUSSION;
    }

    const newParticipant = {
      user: new Types.ObjectId(userId),
      joined: new Date(),
      muted: false,
      grade: null,
    };
    return await this.discussionModel.findOneAndUpdate(
      { insoCode: insoCode },
      { $push: { participants: newParticipant } },
      { new: true },
    );
  }

  @Patch('discussions/:discussionId/participants/:participantId/remove')
  @ApiOperation({
    description: 'The ability to remove a participant from a discussion',
  })
  @ApiTags('Discussion')
  //@UseGuards(JwtAuthGuard, IsDiscussionFacilitatorGuard)
  async removeParticipant(
    @Param('discussionId') discussionId: string,
    @Param('participantId') participantId: string,
  ) {
    const discussionParticipant = await this.discussionModel
      .findOne({
        _id: discussionId,
        'participants.user': new Types.ObjectId(participantId),
      })
      .lean();
    if (!discussionParticipant) {
      throw DISCUSSION_ERRORS.PARTICIPANT_NOT_IN_DISUCSSION;
    }
    // Remove that participant object from the discussion participants array
    return await this.discussionModel.findOneAndUpdate(
      { _id: discussionId },
      { $pull: { participants: { user: new Types.ObjectId(participantId) } } },
    );
  }

  @Post('discussions/:discussionId/tags')
  @ApiOperation({
    description: 'The ability to remove a participant from a discussion',
  })
  @ApiBody({ type: DiscussionTagCreateDTO })
  @ApiTags('Tags')
  //@UseGuards(JwtAuthGuard, IsDiscussionMemberGuard)
  async addTag(
    @Param('discussionId') discussionId: string,
    @Body('tag') tag: string,
  ): Promise<HydratedDocument<Discussion>> {
    const discussion = await this.discussionModel
      .findOne({ _id: discussionId })
      .lean();
    if (!discussion) {
      throw DISCUSSION_ERRORS.DISCUSSION_NOT_FOUND;
    }
    // Check if the tag is already in the array
    if (discussion.tags.includes(tag.toString())) {
      throw DISCUSSION_ERRORS.DUPLICATE_TAG;
    }
    // Add the tag to the tags array on the discussion
    return await this.discussionModel.findOneAndUpdate(
      { _id: discussionId },
      { $push: { tags: tag.toString() } },
      { new: true },
    );
  }

  @Patch('users/:userId/discussions/:discussionId/mute')
  @ApiOperation({ description: 'The ability to mute a user in a discussion' })
  @ApiOkResponse({ description: 'Discussion has been muted' })
  @ApiTags('Discussion')
  @UseGuards(JwtAuthGuard, IsDiscussionFacilitatorGuard)
  async muteUserInDiscussion(
    @Param('userId') userId: string,
    @Param('discussionId') discussionId: string,
  ): Promise<any> {
    //Invalid UserId and DiscussionId
    if (!Types.ObjectId.isValid(userId)) {
      throw DISCUSSION_ERRORS.USER_ID_INVALID;
    }

    if (!Types.ObjectId.isValid(discussionId)) {
      throw DISCUSSION_ERRORS.DISCUSSION_ID_INVALID;
    }

    //UserId and DiscussionId not found
    const findUser = await this.userModel.findOne({
      _id: new Types.ObjectId(userId),
    });
    if (!findUser) {
      throw DISCUSSION_ERRORS.USER_NOT_FOUND;
    }

    const findDiscussion = await this.discussionModel.findOne({
      _id: new Types.ObjectId(discussionId),
    });
    if (!findDiscussion) {
      throw DISCUSSION_ERRORS.DISCUSSION_NOT_FOUND;
    }

    return await this.discussionModel.findOneAndUpdate(
      { _id: discussionId, 'participants.user': new Types.ObjectId(userId) },
      { $set: { 'participants.$.muted': true } },
      { new: true },
    );
  }

  @Delete('discussion/:discussionId')
  @ApiOperation({ description: 'Delete the discussion' })
  @ApiParam({ name: '', description: '' })
  @ApiOkResponse({ description: '' })
  @ApiBadRequestResponse({
    description:
      'The discussion has already been answered. It cannot be deleted',
  })
  @ApiUnauthorizedResponse({ description: '' })
  @ApiNotFoundResponse({ description: '' })
  @ApiTags('Discussion')
  @UseGuards(JwtAuthGuard, IsDiscussionCreatorGuard)
  async deleteDiscussion(
    @Param('discussionId') discussionId: string,
  ): Promise<string> {
    // Check if there are any posts before deleting
    const discussion = new Types.ObjectId(discussionId);
    const posts = await this.postModel.find({ discussionId: discussion });
    if (posts.length > 0) {
      throw DISCUSSION_ERRORS.DISCUSSION_HAS_POSTS;
    }
    await this.discussionModel.deleteOne({ _id: discussion });
    return 'Discussion deleted';
  }

  //** PRIVATE FUNCTIONS */

  async getPostsAndComments(post: any) {
    const comments = await this.postModel
      .find({ comment_for: post._id })
      .sort({ date: -1 })
      .populate('userId', [
        'f_name',
        'l_name',
        'email',
        'username',
        'profilePicture',
      ])
      .lean();
    const reactionTypes = await this.reactionModel
      .find({ postId: post._id })
      .distinct('reaction');

    const reactionsList = [];
    for await (const reaction of reactionTypes) {
      const uniqueReaction = {
        reaction: reaction,
        reactions: [],
      };
      const reactions = await this.reactionModel
        .find({ postId: post._id, reaction: reaction })
        .populate('userId', [
          'f_name',
          'l_name',
          'email',
          'username',
          'profilePicture',
        ])
        .lean();
      uniqueReaction.reactions = reactions;
      reactionsList.push(uniqueReaction);
    }
    const freshComments = [];
    if (comments.length) {
      for await (const comment of comments) {
        const post = await this.getPostsAndComments(comment);
        freshComments.push(post);
      }
    }
    const newPost = {
      ...post,
      user: post.userId,
      reactions: reactionsList,
      comments: freshComments,
    };
    delete newPost.userId;
    return newPost;
  }

  async getTags(posts: any, tags: string[]) {
    let tagsArray = [];
    if (posts.length > 0) {
      const strings = [];
      let postElement;
      let postNoStopWords;
      let temp;

      for (let i = 0; i < posts.length; i++) {
        // Iterate the keys later
        let vars = '';
        // Get the values in the outline
        if (posts[i].post.outline) {
          const outline = posts[i].post.outline;
          for (const key in outline) {
            vars = vars + ' ' + posts[i].post.outline[key];
          }
        }
        const text = posts[i].post.post + vars;
        // Remove any html tags
        const cleanText = text.replace(/<\/?[^>]+(>|$)/g, '');
        postElement = cleanText.split(' ');
        // TODO: Change the tags here
        postNoStopWords = removeStopwords(postElement);
        temp = postNoStopWords.join(' ');
        strings.push(temp);
      }

      let allPosts = strings.join(' ');
      allPosts = allPosts.split('.').join(''); // remove periods from strings
      allPosts = allPosts.split(',').join(''); // remove commas from strings
      allPosts = allPosts.split('!').join(''); // remove explanation points from strings
      allPosts = allPosts.split('?').join(''); // remove question marks from strings
      allPosts = allPosts.split('#').join(''); // remove existing tag signifier from array

      let newArray = allPosts.split(' ');
      newArray = newArray.map((element) => (element = element.toLowerCase()));
      newArray = newArray.filter(function (x) {
        return x !== '';
      });

      tagsArray = count(newArray, 'tag');

      const stringTags = tagsArray.map((tag) => {
        return tag.tag;
      });

      stringTags.forEach((tag, i) => {
        if (tags.includes(tag)) {
          tagsArray = [...tagsArray.slice(i), ...tagsArray.slice(0, i)];
        }
      });
    }
    return tagsArray;
  }
}
