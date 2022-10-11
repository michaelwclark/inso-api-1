import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiOperation, ApiBody, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiTags, ApiForbiddenResponse } from '@nestjs/swagger';
import { Model, Types } from 'mongoose';
import { ObjectUnsubscribedError } from 'rxjs';
import { Reaction, ReactionDocument } from 'src/entities/reaction/reaction';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { IsDiscussionFacilitatorGuard } from '../../auth/guards/userGuards/isDiscussionFacilitator.guard';
import { IsDiscussionMemberGuard } from '../../auth/guards/userGuards/isDiscussionMember.guard';
import { IsPostCreatorGuard } from '../../auth/guards/userGuards/isPostCreator.guard';
import { Discussion, DiscussionDocument } from '../../entities/discussion/discussion';
import { Inspiration, InspirationDocument } from '../../entities/inspiration/inspiration';
import { PostCreateDTO } from '../../entities/post/create-post';
import { PostUpdateDTO } from '../../entities/post/edit-post';
import { DiscussionPost, DiscussionPostDocument } from '../../entities/post/post';
import { Setting, SettingDocument } from '../../entities/setting/setting';
import { User, UserDocument } from '../../entities/user/user';
import { MilestoneService } from '../milestone/milestone.service';
import { NotificationService } from '../notification/notification.service';


@Controller()
export class PostController {
  constructor(
    @InjectModel(Discussion.name) private discussionModel: Model<DiscussionDocument>,
    @InjectModel(DiscussionPost.name) private discussionPostModel: Model<DiscussionPostDocument>,
    @InjectModel(Inspiration.name) private inspirationModel: Model<InspirationDocument>,
    @InjectModel(Setting.name) private settingsModel: Model<SettingDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Reaction.name) private reactionModel: Model<ReactionDocument>,
    private notificationService: NotificationService,
    private milestoneService: MilestoneService
  ) {}

  @Post('discussion/:discussionId/post')
  @ApiOperation({description: 'Create a post in a discussion for a participant'})
  @ApiBody({description: 'Post to create', type: PostCreateDTO})
  @ApiOkResponse({ description: 'Post created'})
  @ApiUnauthorizedResponse({ description: ''})
  @ApiNotFoundResponse({ description: 'User or discussion does not exist'})
  @ApiTags('Post')
  @UseGuards(JwtAuthGuard, IsDiscussionMemberGuard)
  async createPost(
    @Param('discussionId') discussionId: string,
    @Body() post: PostCreateDTO,
    @Req() req: any
    ): Promise<string> {
    const discussion = await this.verifyDiscussion(discussionId);

    if(discussion.archived !== null) {
      throw new HttpException(`${discussionId} is currently archived and is not accepting posts`, HttpStatus.BAD_REQUEST);
    }

    if(discussion.settings.calendar && discussion.settings.calendar.close < new Date()) {
      throw new HttpException(`${discussionId} is currently closed and is not accepting posts`, HttpStatus.BAD_REQUEST);
    }

    let postForComment;
    // Milestone for Comment received
    let milestoneForComment;

    if(post.comment_for) {
      postForComment = await this.discussionPostModel.findOne({ _id: post.comment_for });
      if(!postForComment) {
        throw new HttpException(`${post.comment_for} is not a post and cannot be responded to`, HttpStatus.NOT_FOUND);
      }
      post.comment_for = new Types.ObjectId(post.comment_for);

      // Determine if this is the first comment this user has received for milestones
      const milestone = await this.milestoneService.getMilestoneForUser(postForComment.userId, "Comment Received on Post");
      if(!milestone) {
        milestoneForComment = {
          userId: postForComment.userId,
          type: "comment",
          milestoneName: "Comment Received on Post",
          info: {
            discussionId: new Types.ObjectId(discussionId),
            postId: null,
            date: new Date()
          }
        }
      }
    } else {
      post.comment_for = null;
    }
    const user = await this.userModel.findOne({_id: req.user.userId});

    const checkPost = new PostCreateDTO(post);
    const newPost = new this.discussionPostModel({ 
      ...post,
      discussionId: new Types.ObjectId(discussionId),
      userId: new Types.ObjectId(req.user.userId),
      date: new Date(),
      comment_for: post.comment_for
    });
    const newPostId = await newPost.save();

    const notificationText = post.post.post !== undefined ? post.post.post : "Go to discussion to see response";
   
    
    // Create a notification for each participant if a facilitator posts
    if(discussion.facilitators.includes(new Types.ObjectId(req.user.userId))) {
      for await(const participant of discussion.participants) {
        await this.notificationService.createNotification(participant.user, newPost.userId, { header: `<h1 className="notification-header"><span className="username">@${user.username}</span> responded in <a className="discussion-link" href="${process.env.DISCUSSION_REDIRECT}?id=${discussion._id}">${discussion.name}</a></h1>`, text: `${notificationText}`, type: 'post'});
      }
    }
    

    // If the post is a comment_for something notify that participant that someone responded to them
    if(newPost.comment_for && newPost.userId !== req.userId) {
      await this.notificationService.createNotification(postForComment.userId, newPost.userId, { header: `<h1 className="notification-header"><span className="username">@${user.username}</span> responded to your post sin <a className="discussion-link" href="${process.env.DISCUSSION_REDIRECT}?id=${discussion._id}">${discussion.name}</a></h1>`, text: `${notificationText}`, type: 'replies'})
    }

    // See what milestones have been achieved
    const posts = await this.discussionPostModel.find({userId: req.user.userId}).lean();
    if(posts.length === 1) {
      await this.milestoneService.createMilestoneForUser(
        newPost.userId,
        "posting",
        "1st Post",
        { 
          discussionId: new Types.ObjectId(discussionId),
          postId: new Types.ObjectId(newPostId.toString()),
          date: new Date()
        }
      );
    };

    const postsWithInspirations = await this.discussionPostModel.find({userId: req.user.userId, post_inspiration: { $ne: null }}).lean();
    if(postsWithInspirations.length === 1) {
      await this.milestoneService.createMilestoneForUser(
        newPost.userId,
        "posting",
        "Use a Post Inspiration",
        { 
          discussionId: new Types.ObjectId(discussionId),
          postId: new Types.ObjectId(newPostId.toString()),
          date: new Date()
        }
      );
    }

    if(milestoneForComment) {
      milestoneForComment.info.postId = new Types.ObjectId(newPostId._id);
      await this.milestoneService.createMilestoneForUser(milestoneForComment.userId, milestoneForComment.type, milestoneForComment.milestoneName, milestoneForComment.info);
    }

    return newPostId._id;
  }

  @Patch('discussion/:discussionId/post/:postId')
  @ApiOperation({description: 'Update a post in a discussion'})
  @ApiBody({description: 'Post to update', type: PostUpdateDTO})
  @ApiOkResponse({ description: 'Post updated!'})
  @ApiUnauthorizedResponse({ description: ''})
  @ApiNotFoundResponse({ description: 'User, Post, or discussion does not exist'})
  @ApiTags('Post')
  @UseGuards(JwtAuthGuard, IsPostCreatorGuard)
  async updatePost(@Param('discussionId') discussionId: string, @Param('postId') postId: string, @Body() postUpdates: PostUpdateDTO): Promise<DiscussionPost> {
    // Verify the discussion exists
    const discussion = await this.verifyDiscussion(discussionId);

    // Verify that the postId is valid
    if(!Types.ObjectId.isValid(postId)) {
      throw new HttpException(`${postId} is not a valid postId`, HttpStatus.BAD_REQUEST);
    }

    // Check the post_inspiration is valid
    if(postUpdates.post_inspiration) {
      await this.verifyPostInspiration(postUpdates.post_inspiration, discussion.settings);
    }

    const postUpdate = await this.discussionPostModel.findOneAndUpdate({ _id: new Types.ObjectId(postId)}, { post: postUpdates.post, post_inspiration: postUpdates.post_inspiration });
    if(postUpdate === null) {
      throw new HttpException(`${postId} was not found`, HttpStatus.NOT_FOUND);
    }

    return postUpdate;
  }

  @Patch('discussion/:discussionId/post/:postId/publish')
  @ApiOperation({description: 'Publish a draft post in a discussion'})
  @ApiOkResponse({ description: 'Post published!'})
  @ApiUnauthorizedResponse({ description: ''})
  @ApiNotFoundResponse({ description: 'User, Post, or discussion does not exist'})
  @ApiTags('Post')
  @UseGuards(JwtAuthGuard, IsPostCreatorGuard)
  async publishPost(@Param('discussionId') discussionId: string, @Param('postId') postId: string): Promise<string> {
    await this.verifyDiscussion(discussionId);
    
    // Verify that the postId is valid
    if(!Types.ObjectId.isValid(postId)) {
      throw new HttpException(`${postId} is not a valid postId`, HttpStatus.BAD_REQUEST);
    }
    
    const update = await this.discussionPostModel.findOneAndUpdate( {_id: new Types.ObjectId(postId)}, { draft: false });
    if(update === null) {
      throw new HttpException(`${postId} was not found`, HttpStatus.NOT_FOUND);
    }
    return 'Updated!';
  }

  @Delete('discussion/:discussionId/post/:postId')
  @ApiOperation({description: 'Delete a post'})
  @ApiOkResponse({ description: 'Post deleted!'})
  @ApiUnauthorizedResponse({ description: ''})
  @ApiNotFoundResponse({ description: 'User, Post, or discussion does not exist'})
  @ApiTags('Post')
  @UseGuards(JwtAuthGuard, IsPostCreatorGuard)
  async deletePost(@Param('discussionId') discussionId: string, @Param('postId') postId: string): Promise<any> {
    const discussion = await this.verifyDiscussion(discussionId);
    if(!Types.ObjectId.isValid(postId)) {
      throw new HttpException(`${postId} is not a valid postId`, HttpStatus.BAD_REQUEST);
    }

    // Need to check if the post has comments_for
    const comments = await this.discussionPostModel.find({ comment_for: new Types.ObjectId(postId)});
    if(comments.length > 0) {
      throw new HttpException(`${postId} cannot delete a post that has comments`, HttpStatus.BAD_REQUEST);
    }

    const deleteMarker = await this.discussionPostModel.deleteOne({ _id: new Types.ObjectId(postId)});
    if(deleteMarker.deletedCount === 1) {
      // TODO Remove any milestones achieved that are not longer valid because of delete operation. I.E. this was the 5th post and now they are back to 4
      //await this.milestoneService.checkUserMilestoneProgress(.userId);
      return `${postId} deleted`;
    } else {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
  }

  @Get('discussion/:discussionId/participant/:participantId/posts')
  @ApiOperation({description: 'Get all top level and response posts for a user'})
  @ApiOkResponse({ description: 'Posts for the given user'})
  @ApiUnauthorizedResponse({ description: 'User is not logged in'})
  @ApiForbiddenResponse({ description: 'User is not a facilitator of the discussion'})
  @ApiNotFoundResponse({ description: 'User or discussion does not exist'})
  @ApiTags('Post')
  @UseGuards(JwtAuthGuard, IsDiscussionFacilitatorGuard)
  async getPostsForUser(@Param('discussionId') discussionId: string, @Param('participantId') participantId: string): Promise<any> {
    const discussion = await this.verifyDiscussion(discussionId);
    if(!Types.ObjectId.isValid(participantId)) {
      throw new HttpException(`${participantId} is not a valid participantId`, HttpStatus.BAD_REQUEST);
    }

    const posts = await this.discussionPostModel.find({ discussionId: discussion._id}).populate('userId', ['_id', 'f_name', 'l_name', 'email', 'username']).sort({ date: -1 }).lean();
    const newPosts = [];

    for await(const post of posts) {
      if(post.userId._id.toString() === participantId) {
        if(post.comment_for === null) {
          const newPost = await this.getPostsAndCommentsFromTop(post);
          newPosts.push(newPost);
        } else if(post.comment_for) {
          const newPost = await this.getPostTree(post);
          newPosts.push(newPost);
        }
      }
    }
    return newPosts;
  }


  /** PRIVATE FUNCTIONS */

  async verifyDiscussion(discussionId: string): Promise<any> {
    if(!Types.ObjectId.isValid(discussionId)) {
      throw new HttpException(`${discussionId} is not a valid discussionId`, HttpStatus.BAD_REQUEST);
    }
    const discussion = await this.discussionModel.findOne({ _id: new Types.ObjectId(discussionId)})
      .populate('facilitators', ['f_name', 'l_name', 'email', 'username', 'profilePicture'])
      .populate('poster', ['f_name', 'l_name', 'email', 'username', 'profilePicture'])
      .populate({ path: 'settings', populate: [{ path: 'calendar'}, { path: 'score'}, { path: 'post_inspirations'}]}).lean();
    if(!discussion) {
      throw new HttpException(`${discussionId} was not found`, HttpStatus.NOT_FOUND);
    }
    return discussion;
  }

  async verifyPostInspiration(inspirationId: Types.ObjectId, settingsId: Types.ObjectId) {
    // Check the post_inspiration is valid
    const inspiration = await this.inspirationModel.findOne({ _id: inspirationId });
    if(!inspiration) {
      throw new HttpException(`${inspirationId} is not a valid post inspiration`, HttpStatus.NOT_FOUND);
    }

    // Check if the post inspiration is in the discussion settings inspirations array
    const settings = await this.settingsModel.findOne({ _id: settingsId });
    if(!settings.post_inspirations.includes(inspiration._id)) {
      throw new HttpException(`${inspiration._id} is not an inspiration for this discussion`, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Recursively retrieves a post down a tree
   * @param post 
   * @returns 
   */

  async getPostsAndCommentsFromTop(post: any) {
    const comments = await this.discussionPostModel.find({ comment_for: post._id }).sort({ date: -1}).populate('userId', ['f_name', 'l_name', 'email', 'username', 'profilePicture']).lean();
    const reactions = await this.reactionModel.find({ postId: post._id }).populate('userId', ['f_name', 'l_name', 'email', 'username', 'profilePicture']).lean();
    const freshComments = [];
    if(comments.length) {
      for await(const comment of comments) {
        const post = await this.getPostsAndCommentsFromTop(comment);
        freshComments.push(post);
      }
    }
    let newPost = { ...post, user: post.userId, reactions: reactions, comments: freshComments };
    delete newPost.userId;
    return newPost;
  }


    /**
   * Recursively retrieves a post up a tree
   * @param post 
   * @returns 
   */
  async getPostTree(post: any) {
    const comment = await this.discussionPostModel.findOne({ _id: post.comment_for }).populate('userId', ['f_name', 'l_name', 'email', 'username', 'profilePicture']).lean() as any;
    const reactions = await this.reactionModel.find({ postId: post._id }).populate('userId', ['f_name', 'l_name', 'email', 'username', 'profilePicture']).lean();
  
    comment.comments = [];
    const initialPost = { ...post, user: post.userId, reactions: reactions};
    delete initialPost.userId;
    comment.comments.push(initialPost)

    if(comment.comment_for !== null) {
      const post = await this.getPostTree(comment);
      comment.comments.push(post);
    }
    let newPost = { ...comment, user: comment.userId, reactions: reactions};
    delete newPost.userId;
    return newPost;
  }
}