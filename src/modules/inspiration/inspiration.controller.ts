import { Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiParam, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';


@Controller()
export class InspirationController {
  constructor() {}

  @Post('inspiration')
  @ApiOperation({description: 'Create an inspiration for a discussion'})
  @ApiBody({description: '', type: Object})
  @ApiParam({name: '', description: ''})
  @ApiOkResponse({ description: ''})
  @ApiBadRequestResponse({ description: ''})
  @ApiUnauthorizedResponse({ description: ''})
  @ApiNotFoundResponse({ description: ''})
  @ApiTags('Inspiration')
  createInspiration(): string {
    return 'inspiration'
  }

  @Patch('inspiration/:inspirationId')
  @ApiOperation({description: ''})
  @ApiBody({description: '', type: Object})
  @ApiParam({name: '', description: ''})
  @ApiOkResponse({ description: ''})
  @ApiBadRequestResponse({ description: ''})
  @ApiUnauthorizedResponse({ description: ''})
  @ApiNotFoundResponse({ description: ''})
  @ApiTags('Inspiration')
  updateInspiration(): string {
    return 'inspiration'
  }
}