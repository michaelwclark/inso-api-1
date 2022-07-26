import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Model, Types } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IsReactionCreatorGuard } from 'src/auth/guards/userGuards/isReactionCreator.guard';
import { DiscussionPost, DiscussionPostDocument } from 'src/entities/post/post';
import { CreateReactionDTO } from 'src/entities/reaction/create-reaction';
import { UpdateReactionDTO } from 'src/entities/reaction/edit-reaction';
import { Reaction, ReactionDocument } from 'src/entities/reaction/reaction';

@Controller()
export class ReactionController {
  constructor(
    @InjectModel(DiscussionPost.name) private postModel: Model<DiscussionPostDocument>,
    @InjectModel(Reaction.name) private reactionModel: Model<ReactionDocument>
  ) {}

  @Post('post/:postId/reaction')
  @UseGuards(JwtAuthGuard)
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

    const checkReaction = new Reaction({ ...reaction, postId: new Types.ObjectId(postId)});
    const newReaction = new this.reactionModel(checkReaction);
    return await newReaction.save();
  }

  @Patch('post/:postId/reaction/:reactionId')
  @UseGuards(JwtAuthGuard, IsReactionCreatorGuard)
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
    return;
  }

  @Delete('post/:postId/reaction/:reactionId')
  @UseGuards(JwtAuthGuard, IsReactionCreatorGuard)
  @ApiTags('Reaction')
  async deleteReaction(@Param('postId') postId: string, @Param('reactionId') reactionId: string) {
    if(!Types.ObjectId.isValid(postId)) {
      throw new HttpException(`${postId} is not a valid postId`, HttpStatus.BAD_REQUEST);
    }

    const deleted = await this.reactionModel.deleteOne({ _id: new Types.ObjectId(reactionId)});
    return deleted;
  }
}