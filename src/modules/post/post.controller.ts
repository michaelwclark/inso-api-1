import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiOperation, ApiBody, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { Model, Types } from 'mongoose';
import { Discussion, DiscussionDocument } from 'src/entities/discussion/discussion';
import { Inspiration, InspirationDocument } from 'src/entities/inspiration/inspiration';
import { PostCreateDTO } from 'src/entities/post/create-post';
import { PostUpdateDTO } from 'src/entities/post/edit-post';
import { DiscussionPost, DiscussionPostDocument } from 'src/entities/post/post';
import { Setting, SettingDocument } from 'src/entities/setting/setting';


@Controller()
export class PostController {
  constructor(
    @InjectModel(Discussion.name) private discussionModel: Model<DiscussionDocument>,
    @InjectModel(DiscussionPost.name) private discussionPostModel: Model<DiscussionPostDocument>,
    @InjectModel(Inspiration.name) private inspirationModel: Model<InspirationDocument>,
    @InjectModel(Setting.name) private settingsModel: Model<SettingDocument>,
    // Build a notification service
  ) {}

  @Post('discussion/:discussionId/post')
  @ApiOperation({description: 'Create a post in a discussion for a participant'})
  @ApiBody({description: 'Post to create', type: PostCreateDTO})
  @ApiOkResponse({ description: 'Post created'})
  @ApiUnauthorizedResponse({ description: ''})
  @ApiNotFoundResponse({ description: 'User or discussion does not exist'})
  @ApiTags('Post')
  async createPost(@Param('discussionId') discussionId: string, @Body() post: PostCreateDTO): Promise<string> {
    const discussion = await this.verifyDiscussion(discussionId);
    // Check that the participant is a part of the array
    this.verifyParticipation(post.userId.toString(), discussion);

    if(post.comment_for) {
      const postForComment = await this.discussionPostModel.findOne({ _id: post.comment_for });
      if(!postForComment) {
        throw new HttpException(`${post.comment_for} is not a post and cannot be responded to`, HttpStatus.NOT_FOUND);
      }
    } 

    // Generate Notifications
    // Check Milestones for a user

    const newPost = new this.discussionPostModel({ ...post, discussionId: new Types.ObjectId(discussionId) });
    const newPostId = await newPost.save();
    return newPostId._id;
  }

  @Patch('discussion/:discussionId/post/:postId')
  @ApiOperation({description: 'Update a post in a discussion'})
  @ApiBody({description: 'Post to update', type: PostUpdateDTO})
  @ApiOkResponse({ description: 'Post updated!'})
  @ApiUnauthorizedResponse({ description: ''})
  @ApiNotFoundResponse({ description: 'User, Post, or discussion does not exist'})
  @ApiTags('Post')
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
      return `${postId} deleted`;
    } else {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
  }


  /** PRIVATE FUNCTIONS */

  async verifyDiscussion(discussionId: string): Promise<Discussion> {
    if(!Types.ObjectId.isValid(discussionId)) {
      throw new HttpException(`${discussionId} is not a valid discussionId`, HttpStatus.BAD_REQUEST);
    }
    const discussion = await this.discussionModel.findOne({ _id: new Types.ObjectId(discussionId)});
    if(!discussion) {
      throw new HttpException(`${discussionId} was not found`, HttpStatus.NOT_FOUND);
    }
    return discussion;
  }

  verifyParticipation(userId: string, discussion: Discussion) {
    const participants = discussion.participants.map(participant => {
      return participant.user.toString();
    });
    if(!participants.includes(userId)) {
      throw new HttpException(`${userId} is not a participant in the discussion`, HttpStatus.FORBIDDEN);
    }
  }

  async verifyPostInspiration(inspirationId: Types.ObjectId, settingsId: Types.ObjectId) {
    // Check the post_inspiration is valid
    const inspiration = await this.inspirationModel.findOne({ _id: inspirationId });
    if(!inspiration) {
      throw new HttpException(`${inspirationId} is not a valid post inspiration`, HttpStatus.NOT_FOUND);
    }

    // Check if the post inspiration is in the discussion settings inspirations array
    const settings = await this.settingsModel.findOne({ _id: settingsId });
    if(!settings.inspiration.includes(inspiration._id)) {
      throw new HttpException(`${inspiration._id} is not an inspiration for this discussion`, HttpStatus.BAD_REQUEST);
    }
  }

  async generateNotifications() {
    // If new post '@username posted in discussion' for facilitators
    // Build a notification service that will handle the inserting and checking if it exists and stuff
    // If new comment '@username responded to your post'

  }

  async checkAndGenerateMilestones() {
    // If first post

    // If 10th post

    // If 100th post

    // Generate notification if milestone is reached
  }
}