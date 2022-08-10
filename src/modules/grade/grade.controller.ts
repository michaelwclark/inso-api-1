import { Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiUnauthorizedResponse } from '@nestjs/swagger';


@Controller()
export class GradeController {
  constructor() {}

  @Post('/discussions/:discussionId/participants/:participantId/grade')
  async createGradeForParticipant() {
    
  }

  @Patch('/discussions/:discussionId/participants/:participantId/grade')
  async updateGradeForParticipant() {
    
  }

}