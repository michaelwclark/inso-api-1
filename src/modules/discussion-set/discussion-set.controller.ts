import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiParam, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { DiscussionSetCreateDTO } from 'src/entities/discussion-set/create-discussion-set';
import { DiscussionSetEditDTO } from 'src/entities/discussion-set/edit-discussion-set';


@Controller()
export class DiscussionSetController {
  constructor() {}

  // @Post('discussion-set')
  // createDiscussionSet(): string {
  //   return 'discussion-set'
  // }

  // @Patch('discussion-set/:setId')
  // updateDiscussionSetMetadata(): string {
  //   return 'discussion-set'
  // }

  // @Patch('discussion-set/:setId/discussions')
  // addDiscussionToSet(): string {
  //   return 'discussion-set'
  // }

  // @Patch('discussion-set/:setId/archive')
  // archiveDiscussionSet(): string {
  //   return 'discussion-set'
  // }

  // @Delete('discussion-set/:setId')
  // deleteSet(): string {
  //   return 'discussion-set'
  // }
}