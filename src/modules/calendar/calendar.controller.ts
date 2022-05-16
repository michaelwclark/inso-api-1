import { Controller, Delete, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiParam, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { CalendarCreateDTO } from 'src/entities/calendar/create-calendar';
import { CalendarEditDTO } from 'src/entities/calendar/edit-calendar';


@Controller()
export class CalendarController {
  constructor() {}

  @Post('users/:userId/calendar')
  @ApiOperation({description: ''})
  @ApiBody({description: '', type: CalendarCreateDTO})
  @ApiParam({name: '', description: ''})
  @ApiOkResponse({ description: ''})
  @ApiBadRequestResponse({ description: ''})
  @ApiUnauthorizedResponse({ description: ''})
  @ApiNotFoundResponse({ description: ''})
  @ApiTags('Calendar')
  createCalendar(): string {
    return 'create calendar';
  }

  @Patch('users/:userId/calendar/:calendarId')
  @ApiOperation({description: 'Update a calendar entity'})
  @ApiBody({description: '', type: CalendarEditDTO})
  @ApiParam({name: '', description: ''})
  @ApiOkResponse({ description: ''})
  @ApiBadRequestResponse({ description: ''})
  @ApiUnauthorizedResponse({ description: ''})
  @ApiNotFoundResponse({ description: ''})
  @ApiTags('Calendar')
  updateCalendar(): string {
    return 'update calendar';
  }

  @Delete('users/:userId/calendar/:calendarId')
  @ApiOperation({description: 'Delete a calendar entity'})
  @ApiParam({name: '', description: ''})
  @ApiOkResponse({ description: ''})
  @ApiBadRequestResponse({ description: ''})
  @ApiUnauthorizedResponse({ description: ''})
  @ApiNotFoundResponse({ description: ''})
  @ApiTags('Calendar')
  deleteCalendar(): string{
    return 'delete calendar';
  }
}