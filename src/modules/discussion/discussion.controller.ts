import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiBadRequestResponse, ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CalendarCreateDTO } from 'src/entities/calendar/create-calendar';
import { Model, Types } from 'mongoose';
import { DiscussionCreateDTO } from 'src/entities/discussion/create-discussion';
import { Discussion, DiscussionDocument } from 'src/entities/discussion/discussion';
import { DiscussionEditDTO } from 'src/entities/discussion/edit-discussion';
import { DiscussionReadDTO } from 'src/entities/discussion/read-discussion';
import { Inspiration } from 'src/entities/inspiration/inspiration';
import { Score } from 'src/entities/score/score';
import { SettingsCreateDTO } from 'src/entities/setting/create-setting';
import { Setting } from 'src/entities/setting/setting';
import { makeInsoId } from '../shared/generateInsoCode';
import { User } from 'src/entities/user/user';

@Controller()
export class DiscussionController {
  constructor(@InjectModel(Discussion.name) private discussionModel: Model<DiscussionDocument>, 
              @InjectModel(Setting.name) private settingModel: Model<Setting>,
              @InjectModel(Score.name) private scoreModel: Model<Score>,
              @InjectModel(Inspiration.name) private post_inspirationModel: Model<Inspiration>,
              @InjectModel(User.name) private userModel: Model<Inspiration> ) {}
              
  @Post('discussion')
  @ApiOperation({description: 'Creates a discussion'})
  @ApiBody({description: '', type: DiscussionCreateDTO})
  @ApiOkResponse({ description: 'Discussion created!'})
  @ApiBadRequestResponse({ description: 'The discussion is missing a name, poster, or facilitators'})
  @ApiUnauthorizedResponse({ description: 'The user does not have permission to create a discussion'})
  @ApiNotFoundResponse({ description: 'The poster or one of the facilitators was not found'})
  @ApiTags('Discussion')
  async createDiscussion(@Body() discussion: DiscussionCreateDTO): Promise<Discussion> {
    // Check that user exists in DB
    const user = await this.userModel.findOne({_id: discussion.poster});
    if(!user) {
      throw new HttpException("User trying to create discussion does not exist", HttpStatus.BAD_REQUEST);
    }
    
    // Add the poster to the facilitators
    if(discussion.facilitators === undefined) {
      discussion.facilitators = [];
    }
    discussion.facilitators.push(discussion.poster);

    // Verify that all facilitators exist
    for await (const user of discussion.facilitators) {
      let found = await this.userModel.exists({_id: user});
      if(!found) {
        throw new HttpException("A user does not exist in the facilitators array", HttpStatus.NOT_FOUND);
      }
    }
    // Create Inso Code 
    const code = makeInsoId(5);
    // Check that the code is not active in the database
    let found = new this.discussionModel();
    while(found !== null) {
      found = await this.discussionModel.findOne({ insoCode: code });
      const createdDiscussion = new this.discussionModel({...discussion, insoCode: code});
      return createdDiscussion.save();
    }
  }


  @Patch('discussion/:discussionId/metadata')
  @ApiOperation({description: 'Update the metadata for the discussion'})
  @ApiBody({description: '', type: DiscussionEditDTO})
  @ApiParam({name: '', description: ''})
  @ApiOkResponse({ description: ''})
  @ApiBadRequestResponse({ description: ''})
  @ApiUnauthorizedResponse({ description: ''})
  @ApiNotFoundResponse({ description: ''})
  @ApiTags('Discussion')
  async updateDiscussionMetadata(@Param('discussionId') discussionId: string, @Body() discussion: DiscussionEditDTO): Promise<any> {
    // Check that the ids match
    if(discussionId !== discussion.id.toString()) {
      throw new HttpException("Discussion being updated is not discussion", HttpStatus.BAD_REQUEST)
    }
    // Check that discussion exists
    const found = await this.discussionModel.findOne({_id: discussionId});
    if(!found) {
      throw new HttpException("Discussion not found", HttpStatus.NOT_FOUND);
    }

    // If there are new facilitators verify they exist and push them into the existing array
    for await (const user of discussion.facilitators) {
      let found = await this.userModel.findOne({_id: user});
      if(!found) {
        throw new HttpException("A user does not exist in the facilitators array", HttpStatus.NOT_FOUND);
      }
    }
    discussion.facilitators = discussion.facilitators.concat(found.facilitators);
    // Update the discussion and return the new value
    return await this.discussionModel.findOneAndUpdate({_id: discussionId}, discussion, { new: true });
  }

  @Get('discussion/:discussionId')
  @ApiOperation({description: 'Update the metadata for the discussion'})
  @ApiBody({description: '', type: DiscussionEditDTO})
  @ApiParam({name: 'discussionId', description: 'The id of the discussion'})
  @ApiOkResponse({ description: ''})
  @ApiBadRequestResponse({ description: ''})
  @ApiUnauthorizedResponse({ description: ''})
  @ApiNotFoundResponse({ description: ''})
  @ApiTags('Discussion')
  async getDiscussion(@Param('discussionId') discussionId: string): Promise<string> {
    return 'wowo';
  }

  @Get('discussions')
  @ApiOperation({description: 'Gets discussions for a user from the database'})
  @ApiOkResponse({ description: 'Discussions'})
  @ApiBadRequestResponse({ description: ''})
  @ApiUnauthorizedResponse({ description: ''})
  @ApiNotFoundResponse({ description: ''})
  @ApiTags('Discussion')
  async getDiscussions(): Promise<Discussion[]> {
    return;
  }

  @Patch('discussion/:discussionId/settings')
  @ApiOperation({description: 'Update the discussion settings'})
  @ApiBody({description: '', type: DiscussionEditDTO})
  @ApiParam({name: '', description: ''})
  @ApiOkResponse({ description: ''})
  @ApiBadRequestResponse({ description: ''})
  @ApiUnauthorizedResponse({ description: ''})
  @ApiNotFoundResponse({ description: ''})
  @ApiTags('Discussion')
  async updateDiscussionSettings(
    @Body() setting: SettingsCreateDTO,
    @Param('discussionId') discussionId: string): Promise<any> {
    const found = this.discussionModel.findOne({_id: discussionId})
    
    if (!found){
      this.discussionModel.findOneAndUpdate({_id: discussionId}, setting, { new: true });
    }

    const post_inspiration = await this.post_inspirationModel.findOne({_id: setting.post_inspiration});
    if (!post_inspiration){
      throw new HttpException('Post Inspiration id not found', HttpStatus.BAD_REQUEST);
    }

    const score = await this.scoreModel.findOne({_id: setting.score});
    if (!score){
      throw new HttpException('Score id not found', HttpStatus.BAD_REQUEST);
    }

    console.log(found)
    return 'update discussion settings'
  }

  @Delete('discussion/:discussionId')
  @ApiOperation({description: 'Delete the discussion'})
  @ApiBody({description: '', type: DiscussionEditDTO})
  @ApiParam({name: '', description: ''})
  @ApiOkResponse({ description: ''})
  @ApiBadRequestResponse({ description: 'The discussion has already been answered. It cannot be deleted'})
  @ApiUnauthorizedResponse({ description: ''})
  @ApiNotFoundResponse({ description: ''})
  @ApiTags('Discussion')
  deleteDiscussion(
  ): string {
    return 'deleted discussion settings'
  }
}