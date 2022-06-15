import { HttpException, HttpStatus, INestApplication, HttpServer } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';
import { Calendar, CalendarSchema } from 'src/entities/calendar/calendar';
import { CalendarController } from './calendar.controller';
import * as request from 'supertest';

describe('AppController', () => {
  let appController: CalendarController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let calendarModel: Model<any>;

  let app: INestApplication;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
    
        calendarModel = mongoConnection.model(Calendar.name, CalendarSchema);
  })
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CalendarController],
      providers: [{provide: getModelToken(Calendar.name), useValue: calendarModel}],
    }).compile();

    appController = app.get<CalendarController>(CalendarController);
  });


  // DATA TO PASS THROUGH TEST CASES 

  var open = new Date("2022-06-17");
  var close = new Date("2022-06-25");

  const patchCalendarReq = {
    'id': , //Calendar Object Id
    'open': open,
    'close': close,
    'posting': {
      'open': open,
      'close': close,
    },
    'responding': {
      'open': open,
      'close': close,
    },
    'synthesizing': {
      'open': open,
      'close': close,
    }

  }

  // EXAMPLE TEST 
  describe('root', () => {
    it('Example Test, this should pass', async () => {
      var i = 2 + 2;
      
      expect(i).toBe(4);
    });
  });

  // TEST CASES FOR PATCH ROUTE

  // VALID USER ID AND CALENDAR ID, VALID CALENDAR WRITE DTO, SHOULD RETURN 200 STATUS
  describe('root', () => {
    it('Test case valid update request', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',  // user id
       '629a69deaa8494f552c89cd9',  // calendar id
        patchCalendarReq)).toBe(0)
    });
  });

  // INVALID USER ID, VALID CALENDAR ID, VALID CALENDAR WRITE DTO, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case invalid user id', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // NO USER ID, VALID CALENDAR ID, VALID CALENDAR WRITE DTO, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case no user id provided', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // NON EXISTENT USER ID, VALID CALENDAR ID, VALID CALENDAR WRITE DTO, SHOULD RETURN 404 STATUS
  describe('root', () => {
    it('Test case non existent user id', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // USER ID IS NOT CREATOR ID, VALID CALENDAR ID, VALID CALENDAR WRITE DTO, SHOULD RETURN 403 STATUS
  describe('root', () => {
    it('Test case user id and creator id do not match', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, INVALID CALENDAR ID, VALID CALENDAR WRITE DTO, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case invalid calendar id', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, NO CALENDAR ID, VALID CALENDAR WRITE DTO, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case no calendar id provided', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, NON EXISTENT CALENDAR ID, VALID CALENDAR WRITE DTO, SHOULD RETURN 404 STATUS
  describe('root', () => {
    it('Test case non existent calender id', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, VALID CALENDAR ID, OPEN DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case open date is in the past', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, VALID CALENDAR ID, OPEN DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case open date is not a date', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, VALID CALENDAR ID, OPEN DATE IS EMPTY NULL OR UNDEFINED, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case open date is empty', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, VALID CALENDAR ID, CLOSE DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case close date is in the past', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, VALID CALENDAR ID, CLOSE DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case close date is not a date', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, VALID CALENDAR ID, CLOSE DATE IS EMPTY NULL OR UNDEFINED, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case close date is empty', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, VALID CALENDAR ID, POSTING IS AN EMPTY OBJECT, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case posting is empty', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, VALID CALENDAR ID, POSTING OPEN DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case posting open date is in the past', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, VALID CALENDAR ID, POSTING OPEN DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case posting open date is not a date', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, VALID CALENDAR ID, POSTING OPEN DATE IS EMPTY, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case posting open date is empty', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, VALID CALENDAR ID, POSTING CLOSE DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case posting close date is in the past', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, VALID CALENDAR ID, POSTING CLOSE DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case posting close date is not a date', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, VALID CALENDAR ID, POSTING CLOSE DATE IS EMPTY, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case posting close date is empty', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, VALID CALENDAR ID, RESPONDING IS AN EMPTY OBJECT, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case responding is empty', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, VALID CALENDAR ID, RESPONDING OPEN DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case responding open date is in the past', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, VALID CALENDAR ID, RESPONDING OPEN DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case responding open date is not a date', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, VALID CALENDAR ID, RESPONDING OPEN DATE IS EMPTY, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case responding open date is empty', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, VALID CALENDAR ID, RESPONDING CLOSE DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case responding close date is in the past', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, VALID CALENDAR ID, RESPONDING CLOSE DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case responding close date is not a date', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, VALID CALENDAR ID, RESPONDING CLOSE DATE IS EMPTY, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case responding close date is empty', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, VALID CALENDAR ID, SYNTHESIZING IS AN EMPTY OBJECT, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case synthesizing is empty', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, VALID CALENDAR ID, SYNTHESIZING OPEN DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case synthesizing open date is in the past', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, VALID CALENDAR ID, SYNTHESIZING OPEN DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case synthesizing open date is not a date', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, VALID CALENDAR ID, SYNTHESIZING OPEN DATE IS EMPTY, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case synthesizing open date is empty', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, VALID CALENDAR ID, SYNTHESIZING CLOSE DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case synthesizing close date is in the past', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, VALID CALENDAR ID, SYNTHESIZING CLOSE DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case synthesizing close date is not a date', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, VALID CALENDAR ID, SYNTHESIZING CLOSE DATE IS EMPTY, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case synthesizing close date is empty', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        patchCalendarReq)).toBe(0)
    });
  });

  // VALID USER ID, VALID CALENDAR ID, EMPTY OBJECT, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case synthesizing close date is empty', async () => {
      
      expect(await appController.updateCalendar(
       '629a3aaa17d028a1f19f0e5c',
       '629a69deaa8494f552c89cd9',
        null)).toBe(0)
    });
  });

});