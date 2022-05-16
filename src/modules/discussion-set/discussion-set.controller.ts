import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiParam, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { DiscussionSetCreateDTO } from 'src/entities/discussion-set/create-discussion-set';
import { DiscussionSetEditDTO } from 'src/entities/discussion-set/edit-discussion-set';


@Controller()
export class DiscussionSetController {
  constructor() {}

  @Post('discussion-set')
  @ApiOperation({description: 'Creates a discussion Set'})
  @ApiBody({description: '', type: DiscussionSetCreateDTO})
  @ApiParam({name: '', description: ''})
  @ApiOkResponse({ description: ''})
  @ApiBadRequestResponse({ description: ''})
  @ApiUnauthorizedResponse({ description: ''})
  @ApiNotFoundResponse({ description: ''})
  @ApiTags('Discussion Set')
  createDiscussionSet(): string {
    return 'discussion-set'
  }

  @Patch('discussion-set/:setId')
  @ApiOperation({description: 'Updates a discussion set'})
  @ApiBody({description: '', type: DiscussionSetEditDTO})
  @ApiParam({name: '', description: ''})
  @ApiOkResponse({ description: ''})
  @ApiBadRequestResponse({ description: ''})
  @ApiUnauthorizedResponse({ description: ''})
  @ApiNotFoundResponse({ description: ''})
  @ApiTags('Discussion Set')
  updateDiscussionSetMetadata(): string {
    return 'discussion-set'
  }

  @Patch('discussion-set/:setId/discussions')
  @ApiOperation({description: 'Updates the list of discussions in a discussion set'})
  @ApiBody({description: '', type: DiscussionSetEditDTO})
  @ApiParam({name: '', description: ''})
  @ApiOkResponse({ description: ''})
  @ApiBadRequestResponse({ description: ''})
  @ApiUnauthorizedResponse({ description: ''})
  @ApiNotFoundResponse({ description: ''})
  @ApiTags('Discussion Set')
  addDiscussionToSet(): string {
    return 'discussion-set'
  }

  @Patch('discussion-set/:setId/archive')
  @ApiOperation({description: 'Updates the archived status of a discussion set'})
  @ApiBody({description: '', type: DiscussionSetEditDTO})
  @ApiParam({name: 'setId', description: 'The ObjectId of the discussion-set'})
  @ApiOkResponse({ description: ''})
  @ApiBadRequestResponse({ description: ''})
  @ApiUnauthorizedResponse({ description: ''})
  @ApiNotFoundResponse({ description: ''})
  @ApiTags('Discussion Set')
  archiveDiscussionSet(): string {
    return 'discussion-set'
  }

  @Delete('discussion-set/:setId')
  @ApiOperation({description: 'Deletes a discussion set'})
  @ApiParam({name: 'setId', description: 'The ObjectId of the set'})
  @ApiOkResponse({ description: ''})
  @ApiBadRequestResponse({ description: 'A discussion has already been answered. You cannot delete the discussion set'})
  @ApiUnauthorizedResponse({ description: ''})
  @ApiNotFoundResponse({ description: ''})
  @ApiTags('Discussion Set')
  deleteSet(): string {
    return 'discussion-set'
  }
}