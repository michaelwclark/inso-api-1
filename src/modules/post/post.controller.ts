import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { Model, Types, HydratedDocument } from 'mongoose';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { IsDiscussionFacilitatorGuard } from '../../auth/guards/userGuards/isDiscussionFacilitator.guard';
import { IsDiscussionMemberGuard } from '../../auth/guards/userGuards/isDiscussionMember.guard';
import { IsPostCreatorGuard } from '../../auth/guards/userGuards/isPostCreator.guard';
import {
  Discussion,
  DiscussionDocument,
} from '../../entities/discussion/discussion';
import {
  Inspiration,
  InspirationDocument,
} from '../../entities/inspiration/inspiration';
import { PostCreateDTO } from '../../entities/post/create-post';
import { PostUpdateDTO } from '../../entities/post/edit-post';
import {
  DiscussionPost,
  DiscussionPostDocument,
} from '../../entities/post/post';
import { Setting, SettingDocument } from '../../entities/setting/setting';
import { User, UserDocument } from '../../entities/user/user';
import { MilestoneService } from '../milestone/milestone.service';
import { NotificationService } from '../notification/notification.service';
import { Reaction, ReactionDocument } from 'src/entities/reaction/reaction';
import POST_ERRORS from './post-errors';
//import { GradeService } from 'src/modules/grade/grade.service';

const Filter = require('bad-words'); // eslint-disable-line

@Controller()
export class PostController {
  constructor(
    @InjectModel(Discussion.name)
    private discussionModel: Model<DiscussionDocument>,
    @InjectModel(DiscussionPost.name)
    private discussionPostModel: Model<DiscussionPostDocument>,
    @InjectModel(Inspiration.name)
    private inspirationModel: Model<InspirationDocument>,
    @InjectModel(Setting.name) private settingsModel: Model<SettingDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Reaction.name) private reactionModel: Model<ReactionDocument>,
    private notificationService: NotificationService,
    private milestoneService: MilestoneService,
    //private gradeService: GradeService,
  ) { }

  @Post('discussion/:discussionId/post')
  @ApiOperation({
    description: 'Create a post in a discussion for a participant',
  })
  @ApiBody({ description: 'Post to create', type: PostCreateDTO })
  @ApiOkResponse({ description: 'Post created' })
  @ApiUnauthorizedResponse({ description: '' })
  @ApiNotFoundResponse({ description: 'User or discussion does not exist' })
  @ApiTags('Post')
  @UseGuards(JwtAuthGuard, IsDiscussionMemberGuard)
  async createPost(
    @Param('discussionId') discussionId: string,
    @Body() post: PostCreateDTO,
    @Req() req: any,
  ): Promise<HydratedDocument<DiscussionPost>> {
    const discussion = await this.verifyDiscussion(discussionId);

    if (discussion.archived !== null) {
      throw POST_ERRORS.DISCUSSION_ARCHIVED;
    }

    // check participant is not muted in discussion
    const participant = discussion.participants.find((participant: any) => {
      return participant.user.toString() === req.user.userId.toString();
    });
    if (participant?.muted) {
      throw POST_ERRORS.USER_MUTED;
    }

    if (
      discussion.settings.calendar &&
      discussion.settings.calendar.close < new Date()
    ) {
      throw POST_ERRORS.DISCUSSION_CLOSED;
    }

    let postForComment;
    // Milestone for Comment received
    let milestoneForComment;

    if (post.comment_for) {
      postForComment = await this.discussionPostModel.findOne({
        _id: post.comment_for,
      });
      if (!postForComment) {
        throw POST_ERRORS.POST_NOT_FOUND;
      }
      post.comment_for = new Types.ObjectId(post.comment_for);

      // Determine if this is the first comment this user has received for milestones
      const milestone = await this.milestoneService.getMilestoneForUser(
        postForComment.userId,
        'Comment Received on Post',
      );
      if (!milestone) {
        milestoneForComment = {
          userId: postForComment.userId,
          type: 'comment',
          milestoneName: 'Comment Received on Post',
          info: {
            discussionId: new Types.ObjectId(discussionId),
            postId: null,
            date: new Date(),
          },
        };
      }
    } else {
      post.comment_for = null;
    }
    const user = await this.userModel.findOne({ _id: req.user.userId });

    if (post.post.post) {
      validateForBadWords(post.post.post);
    } else if (post.post.outline) {
      for (const [key, value] of Object.entries(post.post.outline)) {
        validateForBadWords(`${key}`);
        validateForBadWords(`${value}`);
      }
    }

    new PostCreateDTO(post);
    const newPost = new this.discussionPostModel({
      ...post,
      discussionId: new Types.ObjectId(discussionId),
      userId: new Types.ObjectId(req.user.userId),
      date: new Date(),
      comment_for: post.comment_for,
    });

    const notificationText =
      post.post.post !== undefined
        ? post.post.post
        : 'Go to discussion to see response';

    // Create a notification for each participant if a facilitator posts
    if (discussion.facilitators.includes(new Types.ObjectId(req.user.userId))) {
      for await (const participant of discussion.participants) {
        await this.notificationService.createNotification(
          participant.user,
          newPost.userId,
          {
            header: `<h1 className="notification-header"><span className="username">@${user.username}</span> responded in <a className="discussion-link" href="?id=${discussion._id}&postId=${newPost._id}">${discussion.name}</a></h1>`,
            text: `${notificationText}`,
            type: 'post',
          },
        );
      }
    }

    // If the post is a comment_for something notify that participant that someone responded to them
    if (newPost.comment_for) {
      // && postForComment.userId !== newPost.userId
      await this.notificationService.createNotification(
        postForComment.userId,
        newPost.userId,
        {
          header: `<h1 className="notification-header"><span className="username">@${user.username}</span> responded to your post in <a className="discussion-link" href="?id=${discussion._id}&postId=${newPost._id}">${discussion.name}</a></h1>`,
          text: `${notificationText}`,
          type: 'replies',
        },
      );
      // Grade the user that received the comment
      //this.gradeService.gradeParticipant(new Types.ObjectId(discussionId), discussion.facilitators[0], postForComment.userId, discussion.settings.score);
    }

    // See what milestones have been achieved
    const posts = await this.discussionPostModel
      .find({ userId: req.user.userId })
      .lean();
    if (posts.length === 1) {
      await this.milestoneService.createMilestoneForUser(
        newPost.userId,
        'posting',
        '1st Post',
        {
          discussionId: new Types.ObjectId(discussionId),
          postId: newPost._id,
          date: new Date(),
        },
      );
    }

    const postsWithInspirations = await this.discussionPostModel
      .find({ userId: req.user.userId, post_inspiration: { $ne: null } })
      .lean();
    if (postsWithInspirations.length === 1) {
      await this.milestoneService.createMilestoneForUser(
        newPost.userId,
        'posting',
        'Use a Post Inspiration',
        {
          discussionId: new Types.ObjectId(discussionId),
          postId: newPost._id,
          date: new Date(),
        },
      );
    }

    if (milestoneForComment) {
      milestoneForComment.info.postId = newPost._id;
      await this.milestoneService.createMilestoneForUser(
        milestoneForComment.userId,
        milestoneForComment.type,
        milestoneForComment.milestoneName,
        milestoneForComment.info,
      );
    }

    //this.gradeService.gradeParticipant(new Types.ObjectId(discussionId), discussion.facilitators[0], newPost.userId, discussion.settings.score);
    return newPost.save();
  }

  @Patch('discussion/:discussionId/post/:postId')
  @ApiOperation({ description: 'Update a post in a discussion' })
  @ApiBody({ description: 'Post to update', type: PostUpdateDTO })
  @ApiOkResponse({ description: 'Post updated!' })
  @ApiUnauthorizedResponse({ description: '' })
  @ApiNotFoundResponse({
    description: 'User, Post, or discussion does not exist',
  })
  @ApiTags('Post')
  @UseGuards(JwtAuthGuard, IsPostCreatorGuard)
  async updatePost(
    @Param('discussionId') discussionId: string,
    @Param('postId') postId: string,
    @Body() postUpdates: PostUpdateDTO,
  ): Promise<DiscussionPost> {
    // Verify the discussion exists
    const discussion = await this.verifyDiscussion(discussionId);

    // Verify that the postId is valid
    if (!Types.ObjectId.isValid(postId)) {
      throw POST_ERRORS.POST_ID_INVALID;
    }

    // Check the post_inspiration is valid
    if (postUpdates.post_inspiration) {
      await this.verifyPostInspiration(
        postUpdates.post_inspiration,
        discussion.settings,
      );
    }

    if (postUpdates.post.post) {
      validateForBadWords(postUpdates.post.post);
    } else if (postUpdates.post.outline) {
      for (const [key, value] of Object.entries(postUpdates.post.outline)) {
        validateForBadWords(`${key}`);
        validateForBadWords(`${value}`);
      }
    }

    //const newPost =
    new PostUpdateDTO(postUpdates);
    const postUpdate = await this.discussionPostModel.findOneAndUpdate(
      { _id: new Types.ObjectId(postId) },
      {
        post: postUpdates.post,
        post_inspiration: postUpdates.post_inspiration,
      },
    );
    if (postUpdate === null) {
      throw POST_ERRORS.POST_NOT_FOUND;
    }

    return postUpdate;
  }

  @Patch('discussion/:discussionId/post/:postId/publish')
  @ApiOperation({ description: 'Publish a draft post in a discussion' })
  @ApiOkResponse({ description: 'Post published!' })
  @ApiUnauthorizedResponse({ description: '' })
  @ApiNotFoundResponse({
    description: 'User, Post, or discussion does not exist',
  })
  @ApiTags('Post')
  @UseGuards(JwtAuthGuard, IsPostCreatorGuard)
  async publishPost(
    @Param('discussionId') discussionId: string,
    @Param('postId') postId: string,
  ): Promise<string> {
    await this.verifyDiscussion(discussionId);

    // Verify that the postId is valid
    if (!Types.ObjectId.isValid(postId)) {
      throw POST_ERRORS.POST_ID_INVALID;
    }

    const update = await this.discussionPostModel.findOneAndUpdate(
      { _id: new Types.ObjectId(postId) },
      { draft: false },
    );
    if (update === null) {
      throw POST_ERRORS.POST_NOT_FOUND;
    }
    return 'Updated!';
  }

  @Delete('discussion/:discussionId/post/:postId')
  @ApiOperation({ description: 'Delete a post' })
  @ApiOkResponse({ description: 'Post deleted!' })
  @ApiUnauthorizedResponse({ description: '' })
  @ApiNotFoundResponse({
    description: 'User, Post, or discussion does not exist',
  })
  @ApiTags('Post')
  @UseGuards(JwtAuthGuard, IsPostCreatorGuard)
  async deletePost(
    @Param('discussionId') discussionId: string,
    @Param('postId') postId: string,
  ): Promise<any> {
    await this.verifyDiscussion(discussionId);
    if (!Types.ObjectId.isValid(postId)) {
      throw POST_ERRORS.POST_ID_INVALID;
    }

    // Need to check if the post has comments_for
    const comments = await this.discussionPostModel.find({
      comment_for: new Types.ObjectId(postId),
    });
    if (comments.length > 0) {
      throw POST_ERRORS.CAN_NOT_DELETE_POST;
    }

    const deleteMarker = await this.discussionPostModel.deleteOne({
      _id: new Types.ObjectId(postId),
    });
    if (deleteMarker.deletedCount === 1) {
      return `${postId} deleted`;
    } else {
      throw POST_ERRORS.POST_NOT_FOUND;
    }
  }

  @Get('discussion/:discussionId/participant/:participantId/posts')
  @ApiOperation({
    description: 'Get all top level and response posts for a user',
  })
  @ApiOkResponse({ description: 'Posts for the given user' })
  @ApiUnauthorizedResponse({ description: 'User is not logged in' })
  @ApiForbiddenResponse({
    description: 'User is not a facilitator of the discussion',
  })
  @ApiNotFoundResponse({ description: 'User or discussion does not exist' })
  @ApiTags('Post')
  @UseGuards(JwtAuthGuard, IsDiscussionFacilitatorGuard)
  async getPostsForUser(
    @Param('discussionId') discussionId: string,
    @Param('participantId') participantId: string,
  ): Promise<any> {
    const discussion = await this.verifyDiscussion(discussionId);
    if (!Types.ObjectId.isValid(participantId)) {
      throw POST_ERRORS.PARTICIPANT_ID_INVALID;
    }

    const posts = await this.discussionPostModel
      .find({ discussionId: discussion._id })
      .populate('userId', ['_id', 'f_name', 'l_name', 'email', 'username'])
      .sort({ date: -1 })
      .lean();
    const newPosts = [];

    for await (const post of posts) {
      if (post.userId._id.toString() === participantId) {
        if (post.comment_for === null) {
          const newPost = await this.getPostsAndCommentsFromTop(post);
          newPosts.push(newPost);
        } else if (post.comment_for) {
          const newPost = await this.getPostTree(post);
          newPosts.push(newPost);
        }
      }
    }
    return newPosts;
  }

  /** PRIVATE FUNCTIONS */

  async verifyDiscussion(discussionId: string): Promise<any> {
    if (!Types.ObjectId.isValid(discussionId)) {
      throw POST_ERRORS.DISCUSSION_ID_INVALID;
    }
    const discussion = await this.discussionModel
      .findOne({ _id: new Types.ObjectId(discussionId) })
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
      throw POST_ERRORS.DISCUSSION_NOT_FOUND;
    }
    return discussion;
  }

  async verifyPostInspiration(
    inspirationId: Types.ObjectId,
    settingsId: Types.ObjectId,
  ) {
    // Check the post_inspiration is valid
    const inspiration = await this.inspirationModel.findOne({
      _id: inspirationId,
    });
    if (!inspiration) {
      throw POST_ERRORS.POST_INSPIRATION_NOT_FOUND;
    }

    // Check if the post inspiration is in the discussion settings inspirations array
    const settings = await this.settingsModel.findOne({ _id: settingsId });
    if (!settings.post_inspirations.includes(inspiration._id)) {
      throw POST_ERRORS.POST_INSPIRATION_ID_INVALID;
    }
  }

  /**
   * Recursively retrieves a post down a tree
   * @param post
   * @returns
   */

  async getPostsAndCommentsFromTop(post: any) {
    const comments = await this.discussionPostModel
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
    const reactions = await this.reactionModel
      .find({ postId: post._id })
      .populate('userId', [
        'f_name',
        'l_name',
        'email',
        'username',
        'profilePicture',
      ])
      .lean();
    const freshComments = [];
    if (comments.length) {
      for await (const comment of comments) {
        const post = await this.getPostsAndCommentsFromTop(comment);
        freshComments.push(post);
      }
    }
    const newPost = {
      ...post,
      user: post.userId,
      reactions: reactions,
      comments: freshComments,
    };
    delete newPost.userId;
    return newPost;
  }

  /**
   * Recursively retrieves a post up a tree
   * @param post
   * @returns
   */
  async getPostTree(post: any) {
    const comment = (await this.discussionPostModel
      .findOne({ _id: post.comment_for })
      .populate('userId', [
        'f_name',
        'l_name',
        'email',
        'username',
        'profilePicture',
      ])
      .lean()) as any;
    const reactions = await this.reactionModel
      .find({ postId: post._id })
      .populate('userId', [
        'f_name',
        'l_name',
        'email',
        'username',
        'profilePicture',
      ])
      .lean();

    comment.comments = [];
    const initialPost = { ...post, user: post.userId, reactions: reactions };
    delete initialPost.userId;
    comment.comments.push(initialPost);

    if (comment.comment_for !== null) {
      const post = await this.getPostTree(comment);
      comment.comments.push(post);
    }
    const newPost = { ...comment, user: comment.userId, reactions: reactions };
    delete newPost.userId;
    return newPost;
  }
}

function validateForBadWords(post: string) {
  const filter = new Filter();
  filter.addWords('shithead', 'fuckingking');

  const badwordCheck: string = filter.clean(post);

  if (badwordCheck.includes('*')) {
    throw POST_ERRORS.POST_WITH_BAD_WORDS;
  }
}
