import {
  HttpException,
  HttpStatus,
  INestApplication,
  HttpServer,
} from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect, Types } from 'mongoose';
import {
  validCalendar,
  openDateInPast,
  openDateNotADate,
  openDateEmpty,
  closeDateInPast,
  closeDateNotADate,
  closeDateEmpty,
  postingEmpty,
  postingOpenPast,
  postingOpenNotDate,
  postingOpenEmpty,
  postingClosePast,
  postingCloseNotDate,
  postingCloseEmpty,
  respondingEmpty,
  respondingOpenPast,
  respondingOpenNotDate,
  respondingOpenEmpty,
  respondingClosePast,
  respondingCloseNotDate,
  respondingCloseEmpty,
  synthesizingEmpty,
  synthesizingOpenPast,
  synthesizingOpenNotDate,
  synthesizingOpenEmpty,
  synthesizingClosePast,
  synthesizingCloseNotDate,
  synthesizingCloseEmpty,
} from '../calendarMocksPatch';
import { Calendar, CalendarSchema } from 'src/entities/calendar/calendar';
import { CalendarController } from '../calendar.controller';
import { User, UserSchema } from 'src/entities/user/user';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CalendarEditDTO } from 'src/entities/calendar/edit-calendar';

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
    const seedUser = new userModel({
      _id: new Types.ObjectId('629a3aaa17d028a1f19f0e5c'),
      username: 'mockuser1234',
    });
    const seedUser2 = new userModel({
      _id: new Types.ObjectId('629a3aaa17d028a1f19f0777'),
      username: 'mockuser4321',
    });
    await userModel.insertMany([seedUser, seedUser2]);
    const openDate = new Date('2022-06-25');
    const closeDate = new Date('2022-06-30');
    const seedCalendar = new calendarModel({
      id: new Types.ObjectId('629a69deaa8494f552c89cd9'),
      _id: new Types.ObjectId('629a69deaa8494f552c89cd9'),
      open: openDate,
      close: closeDate,
      posting: {
        open: openDate,
        close: closeDate,
      },
      responding: {
        open: openDate,
        close: closeDate,
      },
      synthesizing: {
        open: openDate,
        close: closeDate,
      },
      creatorId: new Types.ObjectId('629a3aaa17d028a1f19f0e5c'),
    });
    const seedCalendar2 = new calendarModel({
      id: new Types.ObjectId('629a69deaa8494f552c89cd8'),
      _id: new Types.ObjectId('629a69deaa8494f552c89cd8'),
      open: openDate,
      close: closeDate,
      posting: {
        open: openDate,
        close: closeDate,
      },
      responding: {
        open: openDate,
        close: closeDate,
      },
      synthesizing: {
        open: openDate,
        close: closeDate,
      },
      creatorId: new Types.ObjectId('629a3aaa17d028a1f19f0e5c'),
    });
    await calendarModel.insertMany([seedCalendar, seedCalendar2]);
  });
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CalendarController],
      providers: [
        { provide: getModelToken(Calendar.name), useValue: calendarModel },
        { provide: getModelToken(User.name), useValue: userModel },
      ],
    }).compile();

    appController = app.get<CalendarController>(CalendarController);
  });

  // DATA TO PASS THROUGH TEST CASES

  const open = new Date('2023-06-25');
  const close = new Date('2023-06-30');

  const patchCalendarReq = {
    id: new Types.ObjectId('629a69deaa8494f552c89cd9'), //Calendar Object Id
    open: open,
    close: close,
    posting: {
      open: open,
      close: close,
    },
    responding: {
      open: open,
      close: close,
    },
    synthesizing: {
      open: open,
      close: close,
    },
    creatorId: new Types.ObjectId('629a3aaa17d028a1f19f0e5c'),
  };

  // EXAMPLE TEST
  describe('root', () => {
    it('Example Test, this should pass', async () => {
      const i = 2 + 2;

      expect(i).toBe(4);
    });
  });

  // TEST CASES FOR PATCH ROUTE

  // VALID USER ID AND CALENDAR ID, VALID CALENDAR WRITE DTO, SHOULD RETURN 200 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 200 STATUS', () => {
    it('Test case valid update request', async () => {
      expect(
        await appController.updateCalendar(
          '629a3aaa17d028a1f19f0e5c', // user id
          '629a69deaa8494f552c89cd9', // calendar id
          validCalendar,
        ),
      ).toBe('Calendar Updated');
    }); // FINISHED
  });

  // INVALID USER ID, VALID CALENDAR ID, VALID CALENDAR WRITE DTO, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case invalid user id', async () => {
      const error = new HttpException(
        'User id is not valid',
        HttpStatus.BAD_REQUEST,
      );
      expect(async () => {
        await appController.updateCalendar(
          'ThisUserIdIsInvalid',
          '629a69deaa8494f552c89cd9',
          validCalendar,
        );
      }).rejects.toThrow(error);
    }); // FINISHED
  });

  // NO USER ID, VALID CALENDAR ID, VALID CALENDAR WRITE DTO, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case no user id provided', async () => {
      const error = new HttpException(
        'No user id provided',
        HttpStatus.BAD_REQUEST,
      );
      expect(async () => {
        await appController.updateCalendar(
          null,
          '629a69deaa8494f552c89cd9',
          validCalendar,
        );
      }).rejects.toThrow(error);
    }); // FINISHED
  });

  // NON EXISTENT USER ID, VALID CALENDAR ID, VALID CALENDAR WRITE DTO, SHOULD RETURN 404 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 404 STATUS', () => {
    it('Test case non existent user id', (done) => {
      const error = new HttpException(
        'User does not exist',
        HttpStatus.BAD_REQUEST,
      );
      expect(async () => {
        await appController.updateCalendar(
          '629a69deaa8494f552c89cd9',
          '629a69deaa8494f552c89cd9',
          validCalendar,
        );
      }).rejects.toThrow(error);
      done();
    }); // NOT FINISHED
  });

  // VALID USER ID, INVALID CALENDAR ID, VALID CALENDAR WRITE DTO, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case invalid calendar id', async () => {
      const error = new HttpException(
        'Calendar id is not valid',
        HttpStatus.BAD_REQUEST,
      );
      expect(async () => {
        await appController.updateCalendar(
          '629a3aaa17d028a1f19f0e5c',
          'ThisCalendarIdIsInValid',
          validCalendar,
        );
      }).rejects.toThrow(error);
    }); // FINISHED
  });

  // VALID USER ID, NO CALENDAR ID, VALID CALENDAR WRITE DTO, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case no calendar id provided', async () => {
      const error = new HttpException(
        'No calendar id provided',
        HttpStatus.BAD_REQUEST,
      );
      expect(async () => {
        await appController.updateCalendar(
          '629a3aaa17d028a1f19f0e5c',
          null,
          validCalendar,
        );
      }).rejects.toThrow(error);
    }); // FINISHED
  });

  // VALID USER ID, NON EXISTENT CALENDAR ID, VALID CALENDAR WRITE DTO, SHOULD RETURN 404 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 404 STATUS', () => {
    it('Test case non existent calender id', (done) => {
      const error = new HttpException(
        'Calendar does not exist',
        HttpStatus.BAD_REQUEST,
      );
      expect(async () => {
        await appController.updateCalendar(
          '629a3aaa17d028a1f19f0e5c',
          '629a3aaa17d028a1f19f0e5c',
          validCalendar,
        );
      }).rejects.toThrow(error);
      done();
    }); // NOT FINISHED
  });

  // VALID USER ID, VALID CALENDAR ID, OPEN DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case open date is in the past', async () => {
      const error = new HttpException(
        'Open date is in the past',
        HttpStatus.BAD_REQUEST,
      );
      expect(async () => {
        await appController.updateCalendar(
          '629a3aaa17d028a1f19f0e5c',
          '629a69deaa8494f552c89cd9',
          openDateInPast,
        );
      }).rejects.toThrow(error);
    }); // FINISHED
  });

  // VALID USER ID, VALID CALENDAR ID, OPEN DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case open date is not a date', async () => {
      const calendarBad = plainToInstance(CalendarEditDTO, openDateNotADate);
      const errors = await validate(calendarBad);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('open must be a Date');
    }); // FINISHED
  });

  // VALID USER ID, VALID CALENDAR ID, OPEN DATE IS EMPTY NULL OR UNDEFINED, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case open date is empty', async () => {
      const calendarBad = plainToInstance(CalendarEditDTO, openDateEmpty);
      const errors = await validate(calendarBad);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('open must be a Date');
    }); // FINISHED
  });

  // VALID USER ID, VALID CALENDAR ID, CLOSE DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case close date is in the past', async () => {
      const error = new HttpException(
        'Close date is in the past',
        HttpStatus.BAD_REQUEST,
      );
      expect(async () => {
        await appController.updateCalendar(
          '629a3aaa17d028a1f19f0e5c',
          '629a69deaa8494f552c89cd9',
          closeDateInPast,
        );
      }).rejects.toThrow(error);
    }); // FINISHED
  });

  // VALID USER ID, VALID CALENDAR ID, CLOSE DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case close date is not a date', async () => {
      const calendarBad = plainToInstance(CalendarEditDTO, closeDateNotADate);
      const errors = await validate(calendarBad);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('close must be a Date');
    }); // FINISHED
  });

  // VALID USER ID, VALID CALENDAR ID, CLOSE DATE IS EMPTY NULL OR UNDEFINED, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case close date is empty', async () => {
      const calendarBad = plainToInstance(CalendarEditDTO, closeDateEmpty);
      const errors = await validate(calendarBad);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('close must be a Date');
    }); // FINISHED
  });

  // VALID USER ID, VALID CALENDAR ID, POSTING IS AN EMPTY OBJECT, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case posting is empty', async () => {
      const calendarBad = plainToInstance(CalendarEditDTO, postingEmpty);
      const errors = await validate(calendarBad);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(
        'posting must be either object or array',
      );
    }); // FINISHED
  });

  // VALID USER ID, VALID CALENDAR ID, POSTING OPEN DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case posting open date is in the past', async () => {
      const error = new HttpException(
        'Posting Open date is in the past',
        HttpStatus.BAD_REQUEST,
      );
      expect(async () => {
        await appController.updateCalendar(
          '629a3aaa17d028a1f19f0e5c',
          '629a69deaa8494f552c89cd9',
          postingOpenPast,
        );
      }).rejects.toThrow(error);
    }); // FINISHED
  });

  // VALID USER ID, VALID CALENDAR ID, POSTING OPEN DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case posting open date is not a date', async () => {
      const calendarBad = plainToInstance(CalendarEditDTO, postingOpenNotDate);
      const errors = await validate(calendarBad);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isDate;
      expect(message).toBe('posting open must be a Date instance');
    }); // FINISHED
  });

  // VALID USER ID, VALID CALENDAR ID, POSTING OPEN DATE IS EMPTY, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case posting open date is empty', async () => {
      const calendarBad = plainToInstance(CalendarEditDTO, postingOpenEmpty);
      const errors = await validate(calendarBad);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isDate;
      expect(message).toBe('posting open must be a Date instance');
    }); // FINISHED
  });

  // VALID USER ID, VALID CALENDAR ID, POSTING CLOSE DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case posting close date is in the past', async () => {
      const error = new HttpException(
        'Posting Close date is in the past',
        HttpStatus.BAD_REQUEST,
      );
      expect(async () => {
        await appController.updateCalendar(
          '629a3aaa17d028a1f19f0e5c',
          '629a69deaa8494f552c89cd9',
          postingClosePast,
        );
      }).rejects.toThrow(error);
    }); // FINISHED
  });

  // VALID USER ID, VALID CALENDAR ID, POSTING CLOSE DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case posting close date is not a date', async () => {
      const calendarBad = plainToInstance(CalendarEditDTO, postingCloseNotDate);
      const errors = await validate(calendarBad);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isDate;
      expect(message).toBe('posting close must be a Date instance');
    }); // FINISHED
  });

  // VALID USER ID, VALID CALENDAR ID, POSTING CLOSE DATE IS EMPTY, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case posting close date is empty', async () => {
      const calendarBad = plainToInstance(CalendarEditDTO, postingCloseEmpty);
      const errors = await validate(calendarBad);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isDate;
      expect(message).toBe('posting close must be a Date instance');
    }); // FINISHED
  });

  // VALID USER ID, VALID CALENDAR ID, RESPONDING IS AN EMPTY OBJECT, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case responding is empty', async () => {
      const calendarBad = plainToInstance(CalendarEditDTO, respondingEmpty);
      const errors = await validate(calendarBad);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(
        'responding must be either object or array',
      );
    }); // FINISHED
  });

  // VALID USER ID, VALID CALENDAR ID, RESPONDING OPEN DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case responding open date is in the past', async () => {
      const error = new HttpException(
        'Responding Open date is in the past',
        HttpStatus.BAD_REQUEST,
      );
      expect(async () => {
        await appController.updateCalendar(
          '629a3aaa17d028a1f19f0e5c',
          '629a69deaa8494f552c89cd9',
          respondingOpenPast,
        );
      }).rejects.toThrow(error);
    }); // FINISHED
  });

  // VALID USER ID, VALID CALENDAR ID, RESPONDING OPEN DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case responding open date is not a date', async () => {
      const calendarBad = plainToInstance(
        CalendarEditDTO,
        respondingOpenNotDate,
      );
      const errors = await validate(calendarBad);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isDate;
      expect(message).toBe('responding open must be a Date instance');
    }); // FINISHED
  });

  // VALID USER ID, VALID CALENDAR ID, RESPONDING OPEN DATE IS EMPTY, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case responding open date is empty', async () => {
      const calendarBad = plainToInstance(CalendarEditDTO, respondingOpenEmpty);
      const errors = await validate(calendarBad);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isDate;
      expect(message).toBe('responding open must be a Date instance');
    }); // FINISHED
  });

  // VALID USER ID, VALID CALENDAR ID, RESPONDING CLOSE DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case responding close date is in the past', async () => {
      const error = new HttpException(
        'Responding Close date is in the past',
        HttpStatus.BAD_REQUEST,
      );
      expect(async () => {
        await appController.updateCalendar(
          '629a3aaa17d028a1f19f0e5c',
          '629a69deaa8494f552c89cd9',
          respondingClosePast,
        );
      }).rejects.toThrow(error);
    }); // FINISHED
  });

  // VALID USER ID, VALID CALENDAR ID, RESPONDING CLOSE DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case responding close date is not a date', async () => {
      const calendarBad = plainToInstance(
        CalendarEditDTO,
        respondingCloseNotDate,
      );
      const errors = await validate(calendarBad);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isDate;
      expect(message).toBe('responding close must be a Date instance');
    }); // FINISHED
  });

  // VALID USER ID, VALID CALENDAR ID, RESPONDING CLOSE DATE IS EMPTY, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case responding close date is empty', async () => {
      const calendarBad = plainToInstance(
        CalendarEditDTO,
        respondingCloseEmpty,
      );
      const errors = await validate(calendarBad);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isDate;
      expect(message).toBe('responding close must be a Date instance');
    }); // FINISHED
  });

  // VALID USER ID, VALID CALENDAR ID, SYNTHESIZING IS AN EMPTY OBJECT, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case synthesizing is empty', async () => {
      const calendarBad = plainToInstance(CalendarEditDTO, synthesizingEmpty);
      const errors = await validate(calendarBad);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(
        'synthesizing must be either object or array',
      );
    }); // FINISHED
  });

  // VALID USER ID, VALID CALENDAR ID, SYNTHESIZING OPEN DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case synthesizing open date is in the past', async () => {
      const error = new HttpException(
        'Synthesizing Open date is in the past',
        HttpStatus.BAD_REQUEST,
      );
      expect(async () => {
        await appController.updateCalendar(
          '629a3aaa17d028a1f19f0e5c',
          '629a69deaa8494f552c89cd9',
          synthesizingOpenPast,
        );
      }).rejects.toThrow(error);
    }); // FINISHED
  });

  // VALID USER ID, VALID CALENDAR ID, SYNTHESIZING OPEN DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case synthesizing open date is not a date', async () => {
      const calendarBad = plainToInstance(
        CalendarEditDTO,
        synthesizingOpenNotDate,
      );
      const errors = await validate(calendarBad);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isDate;
      expect(message).toBe('synthesizing open must be a Date instance');
    }); // FINISHED
  });

  // VALID USER ID, VALID CALENDAR ID, SYNTHESIZING OPEN DATE IS EMPTY, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case synthesizing open date is empty', async () => {
      const calendarBad = plainToInstance(
        CalendarEditDTO,
        synthesizingOpenEmpty,
      );
      const errors = await validate(calendarBad);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isDate;
      expect(message).toBe('synthesizing open must be a Date instance');
    }); // FINISHED
  });

  // VALID USER ID, VALID CALENDAR ID, SYNTHESIZING CLOSE DATE IS IN THE PAST, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case synthesizing close date is in the past', async () => {
      const error = new HttpException(
        'Synthesizing Close date is in the past',
        HttpStatus.BAD_REQUEST,
      );
      expect(async () => {
        await appController.updateCalendar(
          '629a3aaa17d028a1f19f0e5c',
          '629a69deaa8494f552c89cd9',
          synthesizingClosePast,
        );
      }).rejects.toThrow(error);
    }); // FINISHSED
  });

  // VALID USER ID, VALID CALENDAR ID, SYNTHESIZING CLOSE DATE IS NOT A DATE, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case synthesizing close date is not a date', async () => {
      const calendarBad = plainToInstance(
        CalendarEditDTO,
        synthesizingCloseNotDate,
      );
      const errors = await validate(calendarBad);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isDate;
      expect(message).toBe('synthesizing close must be a Date instance');
    }); // FINISHED
  });

  // VALID USER ID, VALID CALENDAR ID, SYNTHESIZING CLOSE DATE IS EMPTY, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case synthesizing close date is empty', async () => {
      const calendarBad = plainToInstance(
        CalendarEditDTO,
        synthesizingCloseEmpty,
      );
      const errors = await validate(calendarBad);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isDate;
      expect(message).toBe('synthesizing close must be a Date instance');
    }); // FINISHED
  });

  // VALID USER ID, VALID CALENDAR ID, EMPTY OBJECT, SHOULD RETURN 400 STATUS
  describe('PATCH /user/{userId}/calendar/{calendarId} 400 STATUS', () => {
    it('Test case empty object', async () => {
      const error = new HttpException(
        'Object is empty',
        HttpStatus.BAD_REQUEST,
      );
      expect(async () => {
        await appController.updateCalendar(
          '629a3aaa17d028a1f19f0e5c',
          '629a69deaa8494f552c89cd9',
          null,
        );
      }).rejects.toThrow(error);
    }); // FINISHED
  });

  //afterAll(async () => {
  //  return await mongod.stop({doCleanup: true});
  //});
});
