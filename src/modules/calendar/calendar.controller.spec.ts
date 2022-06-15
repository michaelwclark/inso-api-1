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

  const postCalendarReq = {
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


  //  TEST CASES FOR POST ROUTE

  //  VALID USER ID, VALID CALENDAR WRITE DTO, SHOULD RETURN 200 STATUS
  describe('root', () => {
    it('Create Calendar Test', async () => {
      
      expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe(
        {
          "__v": 0,
          "_id": "62a9ee844c21bc99cce377b1",
          "close": "2022-06-25T00:00:00.000Z",
          "open": "2022-06-17T00:00:00.000Z",
          "posting": {
            "close": "2022-06-25T00:00:00.000Z",
             "open": "2022-06-17T00:00:00.000Z"
            },
          "responding": {
            "close": "2022-06-25T00:00:00.000Z",
            "open": "2022-06-17T00:00:00.000Z"
            },
          "synthesizing": {
            "close": "2022-06-25T00:00:00.000Z",
            "open": "2022-06-17T00:00:00.000Z"
            }
          }
      )
    });
  });

  // ALSO VALID USER ID, VALID CALENDAR WRITE DTO, DIFFERENT APPROACH, SHOULD RETURN 200 STATUS
  describe('root', () => {
    it('2nd Post Test', async () => {

      const response =  await request(app.getHttpServer)
      .post('/users/629a3aaa17d028a1f19f0e5c/calendar/')
        //route with a valid user id
      .send(postCalendarReq)

      expect(response.status).toBe(200);
    });
  });

  // EXAMPLE TEST 
  describe('root', () => {
    it('Example Test, should fail', async () => {
      var i = 2 + 2;
      
      expect(i).toBe(5);
    });
  });

  //INVALID USERID, VALID CALENDAR WRITE DTO, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case invalid user', async () => {
      
      //expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe()
    });
  });

  //NO USERID, VALID CALENDAR WRITE DTO, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case no user id', async () => {
      
      //expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe()
    });
  });

  //NON EXISTENT USERID, VALID CALENDAR WRITE DTO, SHOULD RETURN 404 STATUS
  describe('root', () => {
    it('Test case non existent user', async () => {
      
      //expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe()
    });
  });

  //VALID USERID, OPEN DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case open date in the past', async () => {
      
      //expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe()
    });
  });

  //VALID USERID, OPEN DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case open is not a date', async () => {
      
      //expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe()
    });
  });

  //VALID USERID, OPEN DATE IS EMPTY NULL OR UNDEFINED, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case open is undefined', async () => {
      
      //expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe()
    });
  });

  //VALID USERID, CLOSE DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case close date is in the past', async () => {
      
      //expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe()
    });
  });

  //VALID USERID, CLOSE DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case close is not a date', async () => {
      
      //expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe()
    });
  });

  //VALID USERID, CLOSE DATE IS EMPTY NULL OR UNDEFINED, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case close is undefined', async () => {
      
      //expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe()
    });
  });

  //VALID USERID, POSTING IS AN EMPTY OBJECT, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case posting is empty', async () => {
      
      //expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe()
    });
  });

  //VALID USERID, POSTING OPEN DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case posting open date is in the past', async () => {
      
      //expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe()
    });
  });

  //VALID USERID, POSTING OPEN DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case posting open is not a date', async () => {
      
      //expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe()
    });
  });

  //VALID USERID, POSTING OPEN DATE IS EMPTY, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case posting open is empty', async () => {
      
      //expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe()
    });
  });

  //VALID USERID, POSTING CLOSE DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case posting close date is in the past', async () => {
      
      //expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe()
    });
  });

  //VALID USERID, POSTING CLOSE DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case posting close is not a date', async () => {
      
      //expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe()
    });
  });

  //VALID USERID, POSTING CLOSE DATE IS EMPTY, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case posting close is empty', async () => {
      
      //expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe()
    });
  });

  //VALID USERID, RESPONDING IS AN EMPTY OBJECT, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case responding is empty', async () => {
      
      //expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe()
    });
  });

  //VALID USERID, RESPONDING OPEN DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case responding open date is in the past', async () => {
      
      //expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe()
    });
  });

  //VALID USERID, RESPONDING OPEN DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case responding open is not a date', async () => {
      
      //expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe()
    });
  });

  //VALID USERID, RESPONDING OPEN DATE IS EMPTY, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case responding open is empty', async () => {
      
      //expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe()
    });
  });

  //VALID USERID, RESPONDING CLOSE DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case responding close date is in the past', async () => {
      
      //expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe()
    });
  });

  //VALID USERID, RESPONDING CLOSE DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case responding close is not a date', async () => {
      
      //expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe()
    });
  });

  //VALID USERID, RESPONDING CLOSE DATE IS EMPTY, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case responding close is empty', async () => {
      
      //expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe()
    });
  });

  //VALID USERID, SYNTHESIZING IS AN EMPTY OBJECT, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case synthesizing is empty', async () => {
      
      //expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe()
    });
  });

  //VALID USERID, SYNTHESIZING OPEN DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case synthesizing open date is in the past', async () => {
      
      //expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe()
    });
  });

  //VALID USERID, SYNTHESIZING OPEN DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case synthesizing open is not a date', async () => {
      
      //expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe()
    });
  });

  //VALID USERID, SYNTHESIZING OPEN DATE IS EMPTY, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case synthesizing open is empty', async () => {
      
      //expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe()
    });
  });

  //VALID USERID, SYNTHESIZING CLOSE DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case synthesizing close date is in the past', async () => {
      
      //expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe()
    });
  });

  //VALID USERID, SYNTHESIZING CLOSE DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case synthesizing close is not a date', async () => {
      
      //expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe()
    });
  });

  //VALID USERID, SYNTHESIZING CLOSE DATE IS EMPTY, SHOULD RETURN 400 STATUS
  describe('root', () => {
    it('Test case synthesizing close is empty', async () => {
      
      //expect(await appController.createCalendar('629a3aaa17d028a1f19f0e5c', postCalendarReq)).toBe()
    });
  });
});