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
    @InjectModel(Setting.name) private settingsModel: Model<SettingDocument>
  ) {}

  @Post('discussion/:discussionId/post')
  @ApiOperation({description: 'Create a post in a discussion for a participant'})
  @ApiBody({description: 'Post to create', type: PostCreateDTO})
  @ApiOkResponse({ description: 'Post created'})
  @ApiUnauthorizedResponse({ description: ''})
  @ApiNotFoundResponse({ description: 'User or discussion does not exist'})
  @ApiTags('Inspiration')
  async createPost(@Param('discussionId') discussionId: string, @Body() post: PostCreateDTO): Promise<string> {
    if(!Types.ObjectId.isValid(discussionId)) {
      throw new HttpException(`${discussionId} is not a valid discussionId`, HttpStatus.BAD_REQUEST);
    }
    const discussion = await this.discussionModel.findOne({ _id: new Types.ObjectId(discussionId)});
    if(!discussion) {
      throw new HttpException(`${discussionId} was not found`, HttpStatus.NOT_FOUND);
    }
    // Check that the participant is a part of the array
    const participants = discussion.participants.map(participant => {
      return participant.user;
    });
    if(!participants.includes(post.userId)) {
      throw new HttpException(`${post.userId} is not a participant in the discussion`, HttpStatus.FORBIDDEN);
    }

    if(post.comment_for) {
      const postForComment = await this.discussionPostModel.findOne({ _id: post.comment_for });
      if(!postForComment) {
        throw new HttpException(`${post.comment_for} is not a post and cannot be responded to`, HttpStatus.NOT_FOUND);
      }
    } 

    const newPost = new this.discussionPostModel(post);
    const newPostId = await newPost.save();
    return newPostId._id;
  }

  @Patch('discussion/:discussionId/post/:postId')
  @ApiOperation({description: 'Update a post in a discussion'})
  @ApiBody({description: 'Post to update', type: PostUpdateDTO})
  @ApiOkResponse({ description: 'Post updated!'})
  @ApiUnauthorizedResponse({ description: ''})
  @ApiNotFoundResponse({ description: 'User, Post, or discussion does not exist'})
  @ApiTags('Inspiration')
  async updatePost(@Param('discussionId') discussionId: string, @Param('postId') postId: string, @Body() postUpdates: PostUpdateDTO): Promise<DiscussionPost> {
    if(!Types.ObjectId.isValid(discussionId)) {
      throw new HttpException(`${discussionId} is not a valid discussionId`, HttpStatus.BAD_REQUEST);
    }
    const discussion = await this.discussionModel.findOne({ _id: new Types.ObjectId(discussionId)});
    if(!discussion) {
      throw new HttpException(`${discussionId} was not found`, HttpStatus.NOT_FOUND);
    }

    if(!Types.ObjectId.isValid(postId)) {
      throw new HttpException(`${discussionId} is not a valid postId`, HttpStatus.BAD_REQUEST);
    }

    // Check the post_inspiration is valid
    const inspiration = await this.inspirationModel.findOne({ _id: postUpdates.post_inspiration});
    if(!inspiration) {
      throw new HttpException(`${postUpdates.post_inspiration} is not a valid post inspiration`, HttpStatus.NOT_FOUND);
    }

    // Check if the post inspiration is in the discussion settings inspirations array
    const settings = await this.settingsModel.findOne({ _id: discussion.settings });
    if(!settings.inspiration.includes(inspiration._id)) {
      throw new HttpException(`${inspiration._id} is not an inspiration for this discussion`, HttpStatus.BAD_REQUEST);
    }

    return await this.discussionPostModel.findOneAndUpdate({ _id: new Types.ObjectId(postId)}, { postUpdates });
  }

  @Patch('discussion/:discussionId/post/:postId/publish')
  @ApiOperation({description: 'Publish a draft post in a discussion'})
  @ApiOkResponse({ description: 'Post published!'})
  @ApiUnauthorizedResponse({ description: ''})
  @ApiNotFoundResponse({ description: 'User, Post, or discussion does not exist'})
  @ApiTags('Inspiration')
  async publishPost(@Param('discussionId') discussionId: string, @Param('postId') postId: string): Promise<string> {
    return 'publish from draft'
  }

  @Delete('discussion/:discussionId/post/:postId')
  @ApiOperation({description: 'Publish a draft post in a discussion'})
  @ApiOkResponse({ description: 'Post published!'})
  @ApiUnauthorizedResponse({ description: ''})
  @ApiNotFoundResponse({ description: 'User, Post, or discussion does not exist'})
  @ApiTags('Inspiration')
  async deletePost(@Param('discussionId') discussionId: string, @Param('postId') postId: string): Promise<string> {
    return 'publish from draft'
  }
}