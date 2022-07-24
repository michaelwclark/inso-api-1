import { Controller, Get } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiUnauthorizedResponse } from '@nestjs/swagger';


@Controller()
export class GradeController {
  constructor() {}

  // When a grade is created we should check to see if any of the following milestones were reached for the participants:
  // A. Most Upvotes received 
  // B. Most responses received
  // C. Max Score obtained

}