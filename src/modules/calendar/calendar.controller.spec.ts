import { HttpException, HttpStatus, INestApplication, HttpServer, ConsoleLogger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect, Types } from 'mongoose';
import { Calendar, CalendarSchema } from 'src/entities/calendar/calendar';
import { CalendarController } from './calendar.controller';
import * as request from 'supertest';
import { validCalendar, openDateInPast, openDateNotADate, openDateEmpty,
         closeDateInPast, closeDateNotADate, closeDateEmpty, postingEmpty,
         postingOpenPast, postingOpenNotDate, postingOpenEmpty, postingClosePast, 
         postingCloseNotDate, postingCloseEmpty, respondingEmpty, respondingOpenPast,
         respondingOpenNotDate, respondingOpenEmpty, respondingClosePast, respondingCloseNotDate,
         respondingCloseEmpty, synthesizingEmpty, synthesizingOpenPast, synthesizingOpenNotDate,
         synthesizingOpenEmpty, synthesizingClosePast, synthesizingCloseNotDate, synthesizingCloseEmpty }
         from '../calendar/calendarMocks';
import { CalendarCreateDTO } from 'src/entities/calendar/create-calendar';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { User, UserSchema } from 'src/entities/user/user';
import { stringify } from 'querystring';
import { doesNotThrow } from 'assert';
import { error } from 'console';

describe('AppController', () => {
  let appController: CalendarController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let calendarModel: Model<any>;
  let userModel: Model<any>;

  let app: INestApplication;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
    
        calendarModel = mongoConnection.model(Calendar.name, CalendarSchema);
        userModel = mongoConnection.model(User.name, UserSchema);
        const seedUser = new userModel({"_id": new Types.ObjectId('629a3aaa17d028a1f19f0e5c'), "username" : "mockuser1234"})
        await userModel.insertMany(
          [seedUser]
        );

        const app: TestingModule = await Test.createTestingModule({
          controllers: [CalendarController],
          providers: [{provide: getModelToken(Calendar.name), useValue: calendarModel},
          {provide: getModelToken(User.name), useValue: userModel}],
        }).compile();
    
        appController = app.get<CalendarController>(CalendarController);
  })

  //  TEST CASES FOR POST ROUTE

  //  VALID USER ID, VALID CALENDAR WRITE DTO, SHOULD RETURN 200 STATUS
  describe('POST /user/{userId}/calendar 200 STATUS', () => {
    it('Create Calendar Test', done => {
    appController.createCalendar('629a3aaa17d028a1f19f0e5c', validCalendar).then(returnValue => {
      expect(Types.ObjectId.isValid(returnValue)).toBe(true);
    });
    done();
    }); // FINISHED
  });

  // 400 STATUS CODE TEST CASES
   describe('POST /user/{userId}/calendar 400 STATUS', () => {

      it('Test case invalid user', () => {
        const invalidUserError = new HttpException("User id is not valid", HttpStatus.BAD_REQUEST)
        return expect(appController.createCalendar('ThisIsNotAValidUserId', validCalendar)).rejects.toThrow(invalidUserError);
      });
    
      //NO USERID, VALID CALENDAR WRITE DTO, SHOULD RETURN 400 STATUS
      it('Test case no user id', () => {
        const noUserError = new HttpException("No user id provided", HttpStatus.BAD_REQUEST);
        return expect(appController.createCalendar(null, validCalendar)).rejects.toThrow(noUserError);
      });

      //NON EXISTENT USERID, VALID CALENDAR WRITE DTO, SHOULD RETURN 404 STATUS   not finished??????
      it('Test case nonexistent user id', () => {
        const nonexistingUserError = new HttpException("User does not exist", HttpStatus.BAD_REQUEST)
        return expect(appController.createCalendar('629a69deaa8494f552c89cd9', validCalendar)).rejects.toThrow(nonexistingUserError);
      });

      //VALID USERID, OPEN DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
      it('Test case open date in past', () => {
        const openPastError = new HttpException("Open date is in the past", HttpStatus.BAD_REQUEST)
        return expect(appController.createCalendar('629a3aaa17d028a1f19f0e5c', openDateInPast)).rejects.toThrow(openPastError);
      });

      //VALID USERID, OPEN DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
      it('Test case open not a date', async() => {
        const openNotDateCal = plainToInstance(CalendarCreateDTO, openDateNotADate);
        const openNotDateErrors = await validate(openNotDateCal);
        expect(openNotDateErrors.length).not.toBe(0);
        expect(JSON.stringify(openNotDateErrors)).toContain('open must be a Date')
      });

      //VALID USERID, OPEN DATE IS EMPTY NULL OR UNDEFINED, SHOULD RETURN 400 STATUS
      it('Test case open is undefined', async() => {
        const openEmptyCal = plainToInstance(CalendarCreateDTO, openDateEmpty);
        const openEmptyErrors = await validate(openEmptyCal);
        expect(openEmptyErrors.length).not.toBe(0);
        expect(JSON.stringify(openEmptyErrors)).toContain('open must be a Date');
      });

      //VALID USERID, CLOSE DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
      it('Test case close date is in the past', () => {
        const error = new HttpException("Close date is in the past", HttpStatus.BAD_REQUEST)
        return expect(appController.createCalendar('629a3aaa17d028a1f19f0e5c', closeDateInPast)).rejects.toThrow(error);
      });

      //VALID USERID, CLOSE DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
      it('Test case close is not a date', async () => {
        const calendarBad = plainToInstance(CalendarCreateDTO, closeDateNotADate);
        const errors = await validate(calendarBad);
        expect(errors.length).not.toBe(0);
        expect(JSON.stringify(errors)).toContain('close must be a Date');
      });
      

      //VALID USERID, CLOSE DATE IS EMPTY NULL OR UNDEFINED, SHOULD RETURN 400 STATUS
      it('Test case close is undefined', async () => {
        const calendarBad = plainToInstance(CalendarCreateDTO, closeDateEmpty);
        const errors = await validate(calendarBad);
        expect(errors.length).not.toBe(0);
        expect(JSON.stringify(errors)).toContain('close must be a Date');
      });

      //VALID USERID, POSTING IS AN EMPTY OBJECT, SHOULD RETURN 400 STATUS
      it('Test case posting is empty', async () => {
        const calendarBad = plainToInstance(CalendarCreateDTO, postingEmpty);
        const errors = await validate(calendarBad);
        expect(errors.length).not.toBe(0);
        expect(JSON.stringify(errors)).toContain('posting must be either object or array');
      });

      //VALID USERID, POSTING OPEN DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
      it('Test case posting open date is in the past', () => {
        const error = new HttpException("Posting Open date is in the past", HttpStatus.BAD_REQUEST)
        return expect(appController.createCalendar('629a3aaa17d028a1f19f0e5c', postingOpenPast)).rejects.toThrow(error);
      });

     //VALID USERID, POSTING OPEN DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
      it('Test case posting open is not a date', async () => {
        const calendarBad = plainToInstance(CalendarCreateDTO, postingOpenNotDate);
        const errors = await validate(calendarBad);
        expect(errors.length).not.toBe(0);
        const message = errors[0].property + ' ' + errors[0].children[0].constraints.isDate;
        expect(message).toBe('posting open must be a Date instance');
      });

      //VALID USERID, POSTING OPEN DATE IS EMPTY, SHOULD RETURN 400 STATUS
      it('Test case posting open is empty', async () => {
        const calendarBad = plainToInstance(CalendarCreateDTO, postingOpenEmpty);
        const errors = await validate(calendarBad);
        expect(errors.length).not.toBe(0);
        const message = errors[0].property + ' ' + errors[0].children[0].constraints.isDate;
        expect(message).toBe('posting open must be a Date instance');
      });

      //VALID USERID, POSTING CLOSE DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
      it('Test case posting close date is in the past', async () => {
        const error = new HttpException("Posting Close date is in the past", HttpStatus.BAD_REQUEST)
        return expect(appController.createCalendar('629a3aaa17d028a1f19f0e5c', postingClosePast)).rejects.toThrow(error);
      });

      //VALID USERID, POSTING CLOSE DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
      it('Test case posting close is not a date', async () => {
        const calendarBad = plainToInstance(CalendarCreateDTO, postingCloseNotDate);
        const errors = await validate(calendarBad);
        expect(errors.length).not.toBe(0);
        const message = errors[0].property + ' ' + errors[0].children[0].constraints.isDate;
        expect(message).toBe('posting close must be a Date instance');
      }); 


      //VALID USERID, POSTING CLOSE DATE IS EMPTY, SHOULD RETURN 400 STATUS
      it('Test case posting close is empty', async () => {
        const calendarBad = plainToInstance(CalendarCreateDTO, postingCloseEmpty);
        const errors = await validate(calendarBad);
        expect(errors.length).not.toBe(0);
        const message = errors[0].property + ' ' + errors[0].children[0].constraints.isDate;
        expect(message).toBe('posting close must be a Date instance');
      });

      //VALID USERID, RESPONDING IS AN EMPTY OBJECT, SHOULD RETURN 400 STATUS
      it('Test case responding is empty', async () => {
        const calendarBad = plainToInstance(CalendarCreateDTO, respondingEmpty);
        const errors = await validate(calendarBad);
        expect(errors.length).not.toBe(0);
        expect(JSON.stringify(errors)).toContain('responding must be either object or array');
      }); 

      //VALID USERID, RESPONDING OPEN DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
      it('Test case responding open date is in the past', async () => {
        const error = new HttpException("Responding Open date is in the past", HttpStatus.BAD_REQUEST)
        return expect(appController.createCalendar('629a3aaa17d028a1f19f0e5c', respondingOpenPast)).rejects.toThrow(error);  
      });

      //VALID USERID, RESPONDING OPEN DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
      it('Test case responding open is not a date', async () => {
        const calendarBad = plainToInstance(CalendarCreateDTO, respondingOpenNotDate);
        const errors = await validate(calendarBad);
        expect(errors.length).not.toBe(0);
        const message = errors[0].property + ' ' + errors[0].children[0].constraints.isDate;
        expect(message).toBe('responding open must be a Date instance');
      });

      //VALID USERID, RESPONDING OPEN DATE IS EMPTY, SHOULD RETURN 400 STATUS
      it('Test case responding open is empty', async () => {
        const calendarBad = plainToInstance(CalendarCreateDTO, respondingOpenEmpty);
        const errors = await validate(calendarBad);
        expect(errors.length).not.toBe(0);
        const message = errors[0].property + ' ' + errors[0].children[0].constraints.isDate;
        expect(message).toBe('responding open must be a Date instance');
      });

      //VALID USERID, RESPONDING CLOSE DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
      it('Test case responding close date is in the past', async () => {
        const error = new HttpException("Responding Close date is in the past", HttpStatus.BAD_REQUEST)
        return expect(appController.createCalendar('629a3aaa17d028a1f19f0e5c', respondingClosePast)).rejects.toThrow(error);
      });

      //VALID USERID, RESPONDING CLOSE DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
      it('Test case responding close is not a date', async () => {
        const calendarBad = plainToInstance(CalendarCreateDTO, respondingCloseNotDate);
        const errors = await validate(calendarBad);
        expect(errors.length).not.toBe(0);
        const message = errors[0].property + ' ' + errors[0].children[0].constraints.isDate;
        expect(message).toBe('responding close must be a Date instance');
      });

      //VALID USERID, RESPONDING CLOSE DATE IS EMPTY, SHOULD RETURN 400 STATUS
      it('Test case responding close is empty', async () => {
        const calendarBad = plainToInstance(CalendarCreateDTO, respondingCloseEmpty);
        const errors = await validate(calendarBad);
        expect(errors.length).not.toBe(0);
        const message = errors[0].property + ' ' + errors[0].children[0].constraints.isDate;
        expect(message).toBe('responding close must be a Date instance');
      });

      //VALID USERID, SYNTHESIZING IS AN EMPTY OBJECT, SHOULD RETURN 400 STATUS
      it('Test case synthesizing is empty', async () => {
        const calendarBad = plainToInstance(CalendarCreateDTO, synthesizingEmpty);
        const errors = await validate(calendarBad);
        expect(errors.length).not.toBe(0);
        expect(JSON.stringify(errors)).toContain('synthesizing must be either object or array');
      });

      //VALID USERID, SYNTHESIZING OPEN DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
      it('Test case synthesizing open date is in the past', async () => {
        const error = new HttpException("Synthesizing Open date is in the past", HttpStatus.BAD_REQUEST)
        return expect(appController.createCalendar('629a3aaa17d028a1f19f0e5c', synthesizingOpenPast)).rejects.toThrow(error);
      });

      //VALID USERID, SYNTHESIZING OPEN DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
      it('Test case synthesizing open is not a date', async () => {
        const calendarBad = plainToInstance(CalendarCreateDTO, synthesizingOpenNotDate);
        const errors = await validate(calendarBad);
        expect(errors.length).not.toBe(0);
        const message = errors[0].property + ' ' + errors[0].children[0].constraints.isDate;
        expect(message).toBe('synthesizing open must be a Date instance');
      });

      //VALID USERID, SYNTHESIZING OPEN DATE IS EMPTY, SHOULD RETURN 400 STATUS
      it('Test case synthesizing open is empty', async () => {
        const calendarBad = plainToInstance(CalendarCreateDTO, synthesizingOpenEmpty);
        const errors = await validate(calendarBad);
        expect(errors.length).not.toBe(0);
        const message = errors[0].property + ' ' + errors[0].children[0].constraints.isDate;
        expect(message).toBe('synthesizing open must be a Date instance');
      });

      //VALID USERID, SYNTHESIZING CLOSE DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
      it('Test case synthesizing close date is in the past', async () => {
        const error = new HttpException("Synthesizing Close date is in the past", HttpStatus.BAD_REQUEST)
        return expect(appController.createCalendar('629a3aaa17d028a1f19f0e5c', synthesizingClosePast)).rejects.toThrow(error);
      });

      //VALID USERID, SYNTHESIZING CLOSE DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
      it('Test case synthesizing close is not a date', async () => {
        const calendarBad = plainToInstance(CalendarCreateDTO, synthesizingCloseNotDate);
        const errors = await validate(calendarBad);
        expect(errors.length).not.toBe(0);
        const message = errors[0].property + ' ' + errors[0].children[0].constraints.isDate;
        expect(message).toBe('synthesizing close must be a Date instance')
      });

      it('Test case synthesizing close is empty', async () => {
        const calendarBad = plainToInstance(CalendarCreateDTO, synthesizingCloseEmpty);
        const errors = await validate(calendarBad);
        expect(errors.length).not.toBe(0);
        const message = errors[0].property + ' ' + errors[0].children[0].constraints.isDate;
        expect(message).toBe('synthesizing close must be a Date instance')
      });
  });

  afterAll(done => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoConnection.close();
    done()
  });
});