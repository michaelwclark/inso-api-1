import { Body, Controller, Delete, HttpException, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiOperation, ApiBody, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { Model, Types } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IsDiscussionFacilitatorGuard } from 'src/auth/guards/userGuards/isDiscussionFacilitator.guard';
import { IsDiscussionParticipantGuard } from 'src/auth/guards/userGuards/isDiscussionParticipant.guard';
import { IsPostCreatorGuard } from 'src/auth/guards/userGuards/isPostCreator.guard';
import { Discussion, DiscussionDocument } from 'src/entities/discussion/discussion';
import { Inspiration, InspirationDocument } from 'src/entities/inspiration/inspiration';
import { PostCreateDTO } from 'src/entities/post/create-post';
import { PostUpdateDTO } from 'src/entities/post/edit-post';
import { DiscussionPost, DiscussionPostDocument } from 'src/entities/post/post';
import { Setting, SettingDocument } from 'src/entities/setting/setting';
import { User, UserDocument } from 'src/entities/user/user';
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
  @UseGuards(JwtAuthGuard, IsDiscussionParticipantGuard, IsDiscussionFacilitatorGuard)
  async createPost(
    @Param('discussionId') discussionId: string,
    @Body() post: PostCreateDTO,
    @Req() req: any
    ): Promise<string> {
    const discussion = await this.verifyDiscussion(discussionId);
    // Check that the participant is a part of the array
    //this.verifyParticipation(req.user.userId.toString(), discussion);

    if(discussion.archived !== null) {
      throw new HttpException(`${discussionId} is currently archived and is not accepting posts`, HttpStatus.BAD_REQUEST);
    }

    if(discussion.settings.calendar && discussion.settings.calendar.close < new Date()) {
      throw new HttpException(`${discussionId} is currently closed and is not accepting posts`, HttpStatus.BAD_REQUEST);
    }

    if(post.comment_for) {
      const postForComment = await this.discussionPostModel.findOne({ _id: post.comment_for });
      if(!postForComment) {
        throw new HttpException(`${post.comment_for} is not a post and cannot be responded to`, HttpStatus.NOT_FOUND);
      }
      post.comment_for = new Types.ObjectId(post.comment_for);
    } else {
      post.comment_for = null;
    }
    const user = await this.userModel.findOne({_id: req.user.userId});

    const newPost = new this.discussionPostModel({ 
      ...post,
      discussionId: new Types.ObjectId(discussionId),
      userId: new Types.ObjectId(req.user.userId),
      date: new Date(),
      comment_for: post.comment_for
    });
    const newPostId = await newPost.save();

    // Create a notification for each facilitator
    for await(const facilitator of discussion.facilitators) {
      console.log('f', facilitator)
      await this.notificationService.createNotification(facilitator._id, { header: `<h1 class="notification-header">Recent post from <span class="username">@${user.username}</span> in <a class="discussion-link" href="${process.env.DISCUSSION_REDIRECT}">${discussion.name}</a></h1>`, text: `${post.post}`})
    }
    
    // Create a notification for each participant
    for await(const participant of discussion.participants) {
      console.log(participant)
      await this.notificationService.createNotification(participant.user, { header: `<h1 class="notification-header">Recent post from <span class="username">@${user.username}</span> in <a class="discussion-link" href="${process.env.DISCUSSION_REDIRECT}">${discussion.name}</a></h1>`, text: `${post.post}`});

      // Check for milestone achievement
      await this.milestoneService.checkUserMilestoneProgress(participant.user);
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

    await this.milestoneService.checkUserMilestoneProgress(postUpdate.userId);
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


  /** PRIVATE FUNCTIONS */

  async verifyDiscussion(discussionId: string): Promise<any> {
    if(!Types.ObjectId.isValid(discussionId)) {
      throw new HttpException(`${discussionId} is not a valid discussionId`, HttpStatus.BAD_REQUEST);
    }
    const discussion = await this.discussionModel.findOne({ _id: new Types.ObjectId(discussionId)})
      .populate('facilitators', ['f_name', 'l_name', 'email', 'username'])
      .populate('poster', ['f_name', 'l_name', 'email', 'username'])
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
}