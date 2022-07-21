import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Discussion, DiscussionDocument } from 'src/entities/discussion/discussion';
import { PostCreateDTO } from 'src/entities/post/create-post';
import { PostUpdateDTO } from 'src/entities/post/edit-post';
import { DiscussionPost, DiscussionPostDocument } from 'src/entities/post/post';


@Controller()
export class PostController {
  constructor(
    @InjectModel(Discussion.name) private discussionModel: Model<DiscussionDocument>,
    @InjectModel(DiscussionPost.name) private discussionPostModel: Model<DiscussionPostDocument>
  ) {}

  @Post('discussion/:discussionId/post')
  async createPost(@Param('discussionId') discussionId: string, @Body() post: PostCreateDTO): Promise<string> {
    if(!Types.ObjectId.isValid(discussionId)) {
      throw new HttpException(`${discussionId} does not exist`, HttpStatus.BAD_REQUEST);
    }
    const discussion = await this.discussionModel.findOne({ _id: new Types.ObjectId(discussionId)});
    if(!discussion) {
      throw new HttpException(`${discussionId} was not found`, HttpStatus.NOT_FOUND);
    }
    // TODO Check if the user is in the participants array

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
  updatePost(@Param('discussionId') discussionId: string, @Param('postId') postId: string, @Body() postUpdates: PostUpdateDTO): string {
    return 'updated'
  }

  @Patch('discussion/:discussionId/post/:postId/publish')
  publishPost(@Param('discussionId') discussionId: string, @Param('postId') postId: string): string {
    return 'publish from draft'
  }
}