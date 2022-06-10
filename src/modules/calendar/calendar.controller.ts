import { Body, Controller, Delete, HttpCode, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiOperation, ApiBody, ApiParam, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import mongoose, { model, Model, mongo, Types, Schema } from 'mongoose';
import { Calendar, CalendarDocument } from 'src/entities/calendar/calendar';
import { CalendarCreateDTO } from 'src/entities/calendar/create-calendar';
import { CalendarEditDTO } from 'src/entities/calendar/edit-calendar';
import { CalendarDTO } from 'src/entities/calendar/read-calendar';


@Controller()
export class CalendarController {
  constructor(@InjectModel(Calendar.name) private calendarModel: Model<CalendarDocument> ) {}

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
  async createCalendar(@Param('userId') id: string, @Body() calendar: CalendarCreateDTO): Promise<Calendar>{

    if(!Types.ObjectId.isValid(id)){
      //throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
      throw new HttpException("User does not exist", HttpStatus.BAD_REQUEST); //invalid/non-existant user id
      return;
    }

    if(id === null){
      throw new HttpException("No user id provided", HttpStatus.BAD_REQUEST); //No user id provided
      return;
    }

    var now = new Date();
    now.setHours(0, 0, 0, 0);
    //if(Date.parse(calendar.open)-Date.parse(new Date())<0){
    if(calendar.open < now){
      throw new HttpException("Open date is in the past", HttpStatus.BAD_REQUEST);
    }
    if(calendar.close < now){
      throw new HttpException("Close date is in the past", HttpStatus.BAD_REQUEST);
    }
    if(calendar.close < calendar.open){
      throw new HttpException("Close date cannot be before open date.", HttpStatus.BAD_REQUEST);
    }
    if(calendar.posting.open < now){
      throw new HttpException("Posting open date is in the past", HttpStatus.BAD_REQUEST);
    }
    if(calendar.posting.close < now){
      throw new HttpException("Posting close date is in the past", HttpStatus.BAD_REQUEST);
    }
    if(calendar.posting.close < calendar.posting.open){
      throw new HttpException("Posting close date cannot be before posting open date.", HttpStatus.BAD_REQUEST);
    }
    if(calendar.responding.open < now){
      throw new HttpException("Responding open date is in the past", HttpStatus.BAD_REQUEST);
    }
    if(calendar.responding.close < now){
      throw new HttpException("Responding close date is in the past", HttpStatus.BAD_REQUEST);
    }
    if(calendar.responding.close < calendar.responding.open){
      throw new HttpException("Responding close date cannot be before responding open date.", HttpStatus.BAD_REQUEST);
    }
    if(calendar.synthesizing.open < now){
      throw new HttpException("Synthesizing open date is in the past", HttpStatus.BAD_REQUEST);
    }
    if(calendar.synthesizing.close < now){
      throw new HttpException("Synthesizing close date is in the past", HttpStatus.BAD_REQUEST);
    }
    if(calendar.synthesizing.close < calendar.synthesizing.open){
      throw new HttpException("Synthesizing close date cannot be before synthesizing open date.", HttpStatus.BAD_REQUEST);
    }

    const newCalendar = new this.calendarModel({...calendar, creator: id});
    console.log(newCalendar);
    
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
    @Body() calendar: Partial<CalendarEditDTO>): Promise<string> {

      var dataReturned;
    //Querying
    let calendarSchema = new mongoose.Schema({
      id: { type: String, required: true}
    })

    //var mongoose = require('mongoose')
    //let findCalendar = mongoose.model("Calendar", calendarSchema);
    //let findCalendar = this.calendarModel

    //findCalendar.find({_id: id}, (error, data) => {
    this.calendarModel.find({_id: id}, (error, data) => { 
    if(error){
        console.log(error);
      } else {
        console.log(data);
        dataReturned = data;
      }

    })

    //Validation
    if(!Types.ObjectId.isValid(id)){
      //throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
      throw new HttpException("User does not exist", HttpStatus.BAD_REQUEST); //invalid/non-existant user id
    }

    if(!Types.ObjectId.isValid(calendarId)){
      throw new HttpException("Calendar does not exist", HttpStatus.BAD_REQUEST);
    }

    if(calendar.id === null){
      throw new HttpException("No calendar id provided", HttpStatus.BAD_REQUEST); //No calendar id provided
    }

    var now = new Date();
    now.setHours(0, 0, 0, 0);
    
    if(calendar.open < now){
      throw new HttpException("Open date is in the past", HttpStatus.BAD_REQUEST);
    }
    if(calendar.close < now){
      throw new HttpException("Close date is in the past", HttpStatus.BAD_REQUEST);
    }
    if(calendar.close < calendar.open){
      throw new HttpException("Close date cannot be before open date.", HttpStatus.BAD_REQUEST);
    }
    if(calendar.posting.open < now){
      throw new HttpException("Posting open date is in the past", HttpStatus.BAD_REQUEST);
    }
    if(calendar.posting.close < now){
      throw new HttpException("Posting close date is in the past", HttpStatus.BAD_REQUEST);
    }
    if(calendar.posting.close < calendar.posting.open){
      throw new HttpException("Posting close date cannot be before posting open date.", HttpStatus.BAD_REQUEST);
    }
    if(calendar.responding.open < now){
      throw new HttpException("Responding open date is in the past", HttpStatus.BAD_REQUEST);
    }
    if(calendar.responding.close < now){
      throw new HttpException("Responding close date is in the past", HttpStatus.BAD_REQUEST);
    }
    if(calendar.responding.close < calendar.responding.open){
      throw new HttpException("Responding close date cannot be before responding open date.", HttpStatus.BAD_REQUEST);
    }
    if(calendar.synthesizing.open < now){
      throw new HttpException("Synthesizing open date is in the past", HttpStatus.BAD_REQUEST);
    }
    if(calendar.synthesizing.close < now){
      throw new HttpException("Synthesizing close date is in the past", HttpStatus.BAD_REQUEST);
    }
    if(calendar.synthesizing.close < calendar.synthesizing.open){
      throw new HttpException("Synthesizing close date cannot be before synthesizing open date.", HttpStatus.BAD_REQUEST);
    }

    return dataReturned;
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