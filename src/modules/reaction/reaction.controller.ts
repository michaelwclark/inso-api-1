import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiBadRequestResponse, ApiBody, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Model, Types } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IsReactionCreatorGuard } from 'src/auth/guards/userGuards/isReactionCreator.guard';
import { Discussion, DiscussionDocument } from 'src/entities/discussion/discussion';
import { DiscussionPost, DiscussionPostDocument } from 'src/entities/post/post';
import { CreateReactionDTO } from 'src/entities/reaction/create-reaction';
import { UpdateReactionDTO } from 'src/entities/reaction/edit-reaction';
import { Reaction, ReactionDocument } from 'src/entities/reaction/reaction';
import { User, UserDocument } from 'src/entities/user/user';
import { NotificationService } from '../notification/notification.service';

@Controller()
export class ReactionController {
  constructor(
    @InjectModel(DiscussionPost.name) private postModel: Model<DiscussionPostDocument>,
    @InjectModel(Reaction.name) private reactionModel: Model<ReactionDocument>,
    @InjectModel(Discussion.name) private discussionModel: Model<DiscussionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private notificationService: NotificationService
  ) {}

  @Post('post/:postId/reaction')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ description: 'Reaction', type: CreateReactionDTO })
  @ApiOkResponse({ description: 'Reaction created!'})
  @ApiUnauthorizedResponse({ description: 'User is not logged in'})
  @ApiForbiddenResponse({ description: 'User cannot create a reaction for another user'})
  @ApiBadRequestResponse({ description: 'postId is not valid or the emoji option is not valid'})
  @ApiNotFoundResponse({ description: 'The post to react to was not found'})
  @ApiTags('Reaction')
  async createReaction(@Param('postId') postId: string, @Body() reaction: CreateReactionDTO) {
    // Validate postId
    if(!Types.ObjectId.isValid(postId)) {
      throw new HttpException(`${postId} is not valid`, HttpStatus.BAD_REQUEST);
    }

    // Make sure the post exists still
    const post = await this.postModel.findOne({ _id: new Types.ObjectId(postId)});
    if(!post) {
      throw new HttpException(`${postId} does not exist`, HttpStatus.NOT_FOUND);
    }

    const user = await this.userModel.findOne({ _id: reaction.userId});
    const checkReaction = new Reaction({ ...reaction, postId: new Types.ObjectId(postId)});
    const newReaction = new this.reactionModel(checkReaction);
    // Generate a notification
    const discussion = await this.discussionModel.findOne({_id: post.discussionId});
    await this.notificationService.createNotification(post.userId, { header: `<h1 class="notification-header"><span class="username">@${user.username}</span> reacted in <a class="discussion-link" href="${process.env.DISCUSSION_REDIRECT}">${discussion.name}</a></h1>`, text: `${reaction.reaction}`})
    return await newReaction.save();
  }

  @Patch('post/:postId/reaction/:reactionId')
  @UseGuards(JwtAuthGuard, IsReactionCreatorGuard)
  @ApiBody({ description: 'Reaction', type: UpdateReactionDTO })
  @ApiOkResponse({ description: 'Reaction updated!'})
  @ApiUnauthorizedResponse({ description: 'User is not logged in'})
  @ApiForbiddenResponse({ description: 'User cannot update a reaction for another user'})
  @ApiBadRequestResponse({ description: 'postId is not valid or the emoji option is not valid'})
  @ApiNotFoundResponse({ description: 'The post to react to was not found or the reaction was not found'})
  @ApiTags('Reaction')
  async updateReaction(@Param('postId') postId: string, @Param('reactionId') reactionId: string, @Body() reaction: UpdateReactionDTO) {
    if(!Types.ObjectId.isValid(postId)) {
      throw new HttpException(`${postId} is not a valid mongo Id`, HttpStatus.BAD_REQUEST);
    }

    const reactionFound = await this.reactionModel.findOne({ _id: new Types.ObjectId(reactionId)});
    if(!reactionFound) {
      throw new HttpException(`${reactionId} does not exist`, HttpStatus.NOT_FOUND);
    }

    await this.reactionModel.findOneAndUpdate({ _id: new Types.ObjectId(reactionId)}, { reaction: reaction.reaction });
    // Update notifications
    // Update milestones
    return;
  }

  @Delete('post/:postId/reaction/:reactionId')
  @UseGuards(JwtAuthGuard, IsReactionCreatorGuard)
  @ApiBody({ description: 'Delete Reaction' })
  @ApiOkResponse({ description: 'Reaction deleted!'})
  @ApiUnauthorizedResponse({ description: 'User is not logged in'})
  @ApiForbiddenResponse({ description: 'User cannot delete a reaction for another user'})
  @ApiTags('Reaction')
  async deletePostReaction(@Param('postId') postId: string, @Param('reactionId') reactionId: string): Promise<any> {
    if(!Types.ObjectId.isValid(postId)) {
      throw new HttpException(`${postId} is not a valid postId`, HttpStatus.BAD_REQUEST);
    }

    const deleted = await this.reactionModel.deleteOne({ _id: new Types.ObjectId(reactionId)});
    // update notifications 
    // update milestones
    return deleted;
  }
}