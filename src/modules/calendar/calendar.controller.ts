import { Body, Controller, Delete, HttpCode, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiOperation, ApiBody, ApiParam, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { model, Model, mongo, Types, Schema } from 'mongoose';
import { User, UserDocument } from '../../../src/entities/user/user';
import { Calendar, CalendarDocument } from '../../../src/entities/calendar/calendar';
import { CalendarCreateDTO } from '../../../src/entities/calendar/create-calendar';
import { CalendarEditDTO } from '../../../src/entities/calendar/edit-calendar';


@Controller()
export class CalendarController {
  constructor(
    @InjectModel(Calendar.name) private calendarModel: Model<CalendarDocument>,
    @InjectModel(User.name) private userModel: Model<User>
     ) {}

  @HttpCode(200) // should maybe be 201 for creation? 
  @Post('users/:userId/calendar')
  @ApiOperation({description: 'Creates a calendar'})
  @ApiBody({description: '', type: CalendarCreateDTO})
  @ApiParam({name: '', description: ''})
  @ApiOkResponse({ description: 'Calendar Created!'})
  @ApiBadRequestResponse({ description: 'The calendar is not of the correct format.'})
  @ApiUnauthorizedResponse({ description: 'User does not have access.'})
  @ApiNotFoundResponse({ description: 'User does not exist.'})
  @ApiTags('Calendar')
  async createCalendar(@Param('userId') id: string, @Body() calendar: CalendarCreateDTO): Promise<Calendar>{ // function used to return Promise<Calendar>
    
    if(id === null){
      throw new HttpException("No user id provided", HttpStatus.BAD_REQUEST); //No user id provided
      return;
    }
    
    if(!Types.ObjectId.isValid(id)){
      throw new HttpException("User id is not valid", HttpStatus.BAD_REQUEST); //invalid/non-existant user id
      return;
    }

    const user = this.userModel.findOne({_id: id});
    if(!user) {
      throw new HttpException("User does not exist", HttpStatus.BAD_REQUEST);
    }

    ValidateSetOfDates(calendar.open, calendar.close, ""); 
    if(calendar.hasOwnProperty('posting')){
    ValidateSetOfDates(calendar.posting.open, calendar.posting.close, "Posting ");
    }
    if(calendar.hasOwnProperty('responding')){
    ValidateSetOfDates(calendar.responding.open, calendar.responding.close, "Responding ");
    }
    if(calendar.hasOwnProperty('synthesizing')){
    ValidateSetOfDates(calendar.synthesizing.open, calendar.synthesizing.close, "Synthesizing ");
    }

    const newCalendar = new this.calendarModel({...calendar, creator: id});
    
    
    return newCalendar.save();
  }

  @Patch('users/:userId/calendar/:calendarId')
  @ApiOperation({description: 'Update a calendar entity'})
  @ApiBody({description: '', type: CalendarEditDTO})
  @ApiParam({name: '', description: ''})
  @ApiOkResponse({ description: 'Calendar edited!'})
  @ApiBadRequestResponse({ description: 'The calendar is not of the correct format.'})
  @ApiUnauthorizedResponse({ description: 'User does not have access.'})
  @ApiNotFoundResponse({ description: ''})
  @ApiTags('Calendar')
  async updateCalendar(
    @Param('userId') id: string, 
    @Param('calendarId') calendarId: string,
    @Body() calendar: CalendarEditDTO): Promise<string> {


    if(calendar == null){
      throw new HttpException("Object is empty", HttpStatus.BAD_REQUEST)
    }

    const user = this.userModel.findOne({_id: id});
    if(!user) {
      throw new HttpException("User does not exist", HttpStatus.BAD_REQUEST);
    }

    const found = this.calendarModel.findOne({_id: calendarId});
    if(!found) {
      throw new HttpException("Calendar does not exist", HttpStatus.BAD_REQUEST);
    }


    //Validation
    if(id == null){
      throw new HttpException("No user id provided", HttpStatus.BAD_REQUEST); //invalid/non-existant user id
    }

    if(calendarId == null){
      throw new HttpException("No calendar id provided", HttpStatus.BAD_REQUEST); //invalid/non-existant user id
    }

    if(!Types.ObjectId.isValid(id)){
      throw new HttpException("User id is not valid", HttpStatus.BAD_REQUEST); //invalid/non-existant user id
    }

    if(!Types.ObjectId.isValid(calendarId)){
      throw new HttpException("Calendar id is not valid", HttpStatus.BAD_REQUEST);
    }

    if(!calendar.id.equals(calendarId)){
      throw new HttpException("Body id and url id for calendar do not match", HttpStatus.BAD_REQUEST);
    }

    ValidateSetOfDates(calendar.open, calendar.close, "");
    if(calendar.hasOwnProperty('posting')){
    ValidateSetOfDates(calendar.posting.open, calendar.posting.close, "Posting ");
    }
    if(calendar.hasOwnProperty('responding')){
    ValidateSetOfDates(calendar.responding.open, calendar.responding.close, "Responding ");
    }
    if(calendar.hasOwnProperty('synthesizing')){
    ValidateSetOfDates(calendar.synthesizing.open, calendar.synthesizing.close, "Synthesizing ");
    }

    const res = await found.updateOne(calendar);

    return 'Calendar Updated';
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

function ValidateSetOfDates( openDate: Date, closeDate: Date, type: String) { 
    var now = new Date();
    if(openDate < now){
      throw new HttpException(type + "Open date is in the past", HttpStatus.BAD_REQUEST);
    }
    if(closeDate < now){
      throw new HttpException(type + "Close date is in the past", HttpStatus.BAD_REQUEST);
    }
    if(closeDate < openDate){
      throw new HttpException(type + "Close date cannot be before " + type + "Open date.", HttpStatus.BAD_REQUEST);
    }
    return;
  }