import { HttpException, HttpStatus, Post } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance, Type } from 'class-transformer';
import { validate } from 'class-validator';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model, Types } from 'mongoose';
import { Calendar, CalendarSchema } from 'src/entities/calendar/calendar';
import { DiscussionCreateDTO } from 'src/entities/discussion/create-discussion';
import {
  Discussion,
  DiscussionSchema,
} from 'src/entities/discussion/discussion';
import {
  Inspiration,
  InspirationSchema,
} from 'src/entities/inspiration/inspiration';
import { Score, ScoreSchema } from 'src/entities/score/score';
import { SettingsCreateDTO } from 'src/entities/setting/create-setting';
import { Setting, SettingSchema } from 'src/entities/setting/setting';
import { DiscussionPost, DiscussionPostSchema } from 'src/entities/post/post';
import { User, UserSchema } from 'src/entities/user/user';
import { DiscussionController } from '../discussion.controller';
import { AuthModule } from 'src/auth/auth.module';

describe('AppController', () => {
  let appController: DiscussionController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let discussionModel: Model<any>;
  let userModel: Model<any>;
  let settingModel: Model<any>;
  let scoreModel: Model<any>;
  let inspirationModel: Model<any>;
  let calendarModel: Model<any>;
  let postModel: Model<any>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    discussionModel = mongoConnection.model(Discussion.name, DiscussionSchema);
    userModel = mongoConnection.model(User.name, UserSchema);
    settingModel = mongoConnection.model(Setting.name, SettingSchema);
    scoreModel = mongoConnection.model(Score.name, ScoreSchema);
    inspirationModel = mongoConnection.model(
      Inspiration.name,
      InspirationSchema,
    );
    calendarModel = mongoConnection.model(Calendar.name, CalendarSchema);
    postModel = mongoConnection.model(
      DiscussionPost.name,
      DiscussionPostSchema,
    );

    await userModel.insertMany([
      {
        _id: new Types.ObjectId('62b276fda78b2a00063b1de0'),
        f_name: 'Paige',
        l_name: 'Zaleppa',
      },
    ]);

    await calendarModel.insertMany([
      {
        _id: new Types.ObjectId('62b276fda78b2a00063b1de4'),
        open: new Date(),
        close: new Date(),
      },
    ]);

    await settingModel.insertMany([
      {
        id: new Types.ObjectId('62b276fda78b2a00063b1de1'),
        prompt: 'This is a prompt',
        post_inspiration: [new Types.ObjectId('62b276fda78b2a00063b1de2')],
        score: new Types.ObjectId('62b276fda78b2a00063b1de3'),
        calendar: new Types.ObjectId('62b276fda78b2a00063b1de4'),
        userId: new Types.ObjectId('62b276fda78b2a00063b1de0'),
      },
    ]);

    await discussionModel.insertMany([
      {
        _id: new Types.ObjectId('62b276fda78b2a00063b1de0'),
        insoCode: 'inso2',
        name: 'string',
        created: new Date(),
        archived: null,
        settings: new Types.ObjectId('62b276fda78b2a00063b1de1'),
        facilitators: [new Types.ObjectId()],
        poster: new Types.ObjectId(),
        set: [new Types.ObjectId()],
        participants: [
          {
            user: new Types.ObjectId(),
            joined: Date(),
            muted: Boolean,
            grade: new Types.ObjectId(),
          },
        ],
      },
      {
        _id: new Types.ObjectId('62b276fda78b2a00063b1de1'),
        insoCode: 'inso1',
        name: 'string',
        created: new Date(),
        archived: null,
        settings: new Types.ObjectId('62b276fda78b2a00063b1de1'),
        facilitators: [new Types.ObjectId()],
        poster: new Types.ObjectId(),
        set: [new Types.ObjectId()],
        participants: [
          {
            user: new Types.ObjectId('62b276fda78b2a00063b1de1'),
            joined: Date(),
            muted: Boolean,
            grade: null,
          },
        ],
      },
    ]);

    await inspirationModel.insertMany([
      {
        _id: new Types.ObjectId('62b276fda78b2a00063b1de2'),
        name: 'inspo',
        type: 'responding',
        instructions: 'string',
        outline: [
          {
            header: 'string',
            prompt: 'string',
          },
        ],
      },
    ]);

    await scoreModel.insertMany([
      {
        _id: new Types.ObjectId('62b276fda78b2a00063b1de3'),
        type: 'string',
        instructions: {
          posting: 'number',
          responding: 'number',
          synthesizing: 'number',
        },
        interactions: {
          max: 'number',
        },
        impact: {
          max: 'number',
        },
        rubric: {
          max: 'number',
          criteria: [
            {
              description: 'string',
              max: 'number',
            },
          ],
        },
      },
    ]);
  });

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DiscussionController],
      imports: [AuthModule],
      providers: [
        { provide: getModelToken(Discussion.name), useValue: discussionModel },
        { provide: getModelToken(User.name), useValue: userModel },
        { provide: getModelToken(Setting.name), useValue: settingModel },
        { provide: getModelToken(Score.name), useValue: scoreModel },
        {
          provide: getModelToken(Inspiration.name),
          useValue: inspirationModel,
        },
        { provide: getModelToken(Calendar.name), useValue: calendarModel },
        { provide: getModelToken(DiscussionPost.name), useValue: postModel },
      ],
    }).compile();

    appController = app.get<DiscussionController>(DiscussionController);
  });

  describe('POST /discussion 200 Response', () => {
    it('should return a valid calendar', () => {
      const validDiscussion = {
        name: 'Power',
        poster: new Types.ObjectId('62b276fda78b2a00063b1de0'),
        facilitators: [],
      };

      const reqUser = {
        userId: '62b276fda78b2a00063b1de0',
      };

      return expect(
        appController.createDiscussion(validDiscussion, reqUser),
      ).resolves.toMatchObject(validDiscussion);
    });
  });
  //200 status valid for setting here
  describe('PATCH /discussion/:discussionId/settings 200 Status', () => {
    it('should return valid Discussion Id', () => {
      const validDiscussionId = {
        id: new Types.ObjectId('62b276fda78b2a00063b1de1'),
        starter_prompt: 'This is a prompt',
        post_inspiration: [new Types.ObjectId('62b276fda78b2a00063b1de2')],
        score: new Types.ObjectId('62b276fda78b2a00063b1de3'),
        calendar: new Types.ObjectId('62b276fda78b2a00063b1de4'),
        userId: new Types.ObjectId('62b276fda78b2a00063b1de0'),
      };
      return expect(
        appController.updateDiscussionSettings(
          validDiscussionId,
          '62b276fda78b2a00063b1de0',
        ),
      ).resolves.not.toThrow();
    });
  });

  //200 status for participant
  describe('PATCH /users/:userId/discussions/:discussionId/join', () => {
    it('should return valid ParticipantID added', () => {
      return expect(
        appController.joinDiscussion('62b276fda78b2a00063b1de0', 'inso1'),
      ).resolves.not.toThrow();
    });
  });

  //400 status for participant
  describe('PATCH /users/:userId/discussions/:discussionId/join', () => {
    it('should return valid Discussion Id', () => {
      const validParticipantId = {
        user: new Types.ObjectId('62b276fda78b2a00063b1de1'),
        joined: new Date(),
        muted: Boolean,
        grade: null,
      };
      return expect(
        appController.joinDiscussion('62b276fda78b2a00063b1de0', 'inso1'),
      ).resolves.not.toThrow();
    });
  });
  //404 status
  describe('PATCH /users/:userId/discussions/:discussionId/join', () => {
    it('should return valid Discussion Id', () => {
      const validParticipant = {
        user: new Types.ObjectId('62b276fda78b2a00063b1de0'),
        joined: new Date(),
        muted: Boolean(),
        grade: null,
      };
      const error = new HttpException(
        'UserId not found in the discussion',
        HttpStatus.NOT_FOUND,
      );
      return expect(
        appController.joinDiscussion('62b276fda78b2a00063b1de0', 'inso2'),
      ).resolves.not.toThrow(error);
    });
  });

  describe('POST /discussion 401 Response', () => {
    // TODO AFTER AUTHENTICATION IS WRITTEN
  });

  describe('POST /discussion 400 Response', () => {
    it('should throw a 400 for invalid discussion name', async () => {
      const invalidDiscussion = {
        name: 1234,
        poster: new Types.ObjectId(),
      };

      const invalid = plainToInstance(DiscussionCreateDTO, invalidDiscussion);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('name must be a string');
    });

    it('should throw a 400 for invalid userId for poster', async () => {
      const invalidDiscussion = {
        name: 'Invalid testing discussion',
        poster: '123456',
      };

      const invalid = plainToInstance(DiscussionCreateDTO, invalidDiscussion);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('poster must be a mongodb id');
    });

    it('should throw a 400 for an empty object', async () => {
      const invalidDiscussion = {};

      const invalid = plainToInstance(DiscussionCreateDTO, invalidDiscussion);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('name should not be empty');
      expect(JSON.stringify(errors)).toContain('poster should not be empty');
    });

    it('should throw a 400 for missing name', async () => {
      const invalidDiscussion = {
        poster: '62b276fda78b2a00063b1de0',
      };

      const invalid = plainToInstance(DiscussionCreateDTO, invalidDiscussion);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('name should not be empty');
    });

    it('should throw a 400 for missing poster', async () => {
      const invalidDiscussion = {
        name: "I don't have a poster",
      };

      const invalid = plainToInstance(DiscussionCreateDTO, invalidDiscussion);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('poster should not be empty');
    });

    it('should throw a 400 for an undefined poster', async () => {
      const invalidDiscussion = {
        name: "I don't have a poster",
        poster: undefined,
      };

      const invalid = plainToInstance(DiscussionCreateDTO, invalidDiscussion);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('poster should not be empty');
    });

    it('should throw a 400 for an undefined name', async () => {
      const invalidDiscussion = {
        name: undefined,
        poster: '62b276fda78b2a00063b1de0',
      };

      const invalid = plainToInstance(DiscussionCreateDTO, invalidDiscussion);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('name should not be empty');
    });

    it('should throw a 400 for an null name', async () => {
      const invalidDiscussion = {
        name: null,
        poster: '62b276fda78b2a00063b1de0',
      };

      const invalid = plainToInstance(DiscussionCreateDTO, invalidDiscussion);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('name should not be empty');
    });

    it('should throw a 400 for an null name', async () => {
      const invalidDiscussion = {
        name: 'I have a null poster bruh',
        poster: null,
      };

      const invalid = plainToInstance(DiscussionCreateDTO, invalidDiscussion);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('poster should not be empty');
    });
  });

  describe('POST /discussion 403 Response', () => {
    // TODO AFTER AUTHORIZATION IS WRITTEN
  });

  describe('POST /discussion 404 Response', () => {
    it('throw a 404 error for poster not found', () => {
      const validDiscussion = {
        name: 'Power',
        poster: new Types.ObjectId(),
        facilitators: [],
      };

      const reqUser = {
        userId: '62b276fda78b2a00063b1de0',
      };
      const error = new HttpException(
        'User trying to create discussion does not exist',
        HttpStatus.NOT_FOUND,
      );
      return expect(
        appController.createDiscussion(validDiscussion, reqUser),
      ).rejects.toThrow(error);
    });

    it('throw a 404 error for a facilitator not found', () => {
      const validDiscussion = {
        name: 'Power',
        poster: new Types.ObjectId('62b276fda78b2a00063b1de0'),
        facilitators: [new Types.ObjectId()],
      };
      const reqUser = {
        userId: '62b276fda78b2a00063b1de0',
      };
      const error = new HttpException(
        'A user does not exist in the facilitators array',
        HttpStatus.NOT_FOUND,
      );
      return expect(
        appController.createDiscussion(validDiscussion, reqUser),
      ).rejects.toThrow(error);
    });
  });

  //400 ERROR STATUS
  describe('PATCH discussion/:discussionId/settings 400 Status', () => {
    //valid discussion id, starter prompt not less than 2
    it('should return a 400 for prompt is less than 2 characters', async () => {
      const validDiscussionId = {
        id: new Types.ObjectId('62b276fda78b2a00063b1de1'),
        prompt: 'T',
        post_inspiration: [new Types.ObjectId('62b276fda78b2a00063b1de2')],
        score: new Types.ObjectId('62b276fda78b2a00063b1de3'),
        calendar: new Types.ObjectId('62b276fda78b2a00063b1de4'),
        userId: new Types.ObjectId('62b276fda78b2a00063b1de0'),
      };

      const invalid = plainToInstance(SettingsCreateDTO, validDiscussionId);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(2);
      expect(JSON.stringify(errors)).toContain(
        'prompt must be longer than or equal to 2 characters',
      );
    });

    //valid discussion id, post inspiration id not valid
    it('should throw a 400 for post inspiration not valid', async () => {
      const validDiscussionId = {
        id: new Types.ObjectId('62b276fda78b2a00063b1de1'),
        starter_prompt: 'This is a prompt',
        post_inspiration: [null],
        score: new Types.ObjectId('62b276fda78b2a00063b1de3'),
        calendar: new Types.ObjectId('62b276fda78b2a00063b1de4'),
        userId: new Types.ObjectId('62b276fda78b2a00063b1de0'),
      };

      const invalid = plainToInstance(SettingsCreateDTO, validDiscussionId);
      const errors = await validate(invalid);

      expect(JSON.stringify(errors)).toContain(
        'each value in post_inspiration must be a mongodb id',
      );
    });

    //valid discussion id, score id is not valid
    it('should throw a 400 for Score Id not valid', async () => {
      const validDiscussionId = {
        id: new Types.ObjectId('62b276fda78b2a00063b1de1'),
        starter_prompt: 'This is a prompt',
        post_inspiration: [new Types.ObjectId('62b276fda78b2a00063b1de2')],
        score: null,
        calendar: new Types.ObjectId('62b276fda78b2a00063b1de4'),
        userId: new Types.ObjectId('62b276fda78b2a00063b1de0'),
      };

      const invalid = plainToInstance(SettingsCreateDTO, validDiscussionId);
      const errors = await validate(invalid);
      expect(JSON.stringify(errors)).toContain('score must be a mongodb id');
    });

    //valid discussion id, calendar id is not valid
    it('should throw a 400 for an undefined calendar', async () => {
      const validDiscussionId = {
        id: new Types.ObjectId('62b276fda78b2a00063b1de1'),
        starter_prompt: 'This is a prompt',
        post_inspiration: [new Types.ObjectId('62b276fda78b2a00063b1de2')],
        score: new Types.ObjectId('62b276fda78b2a00063b1de3'),
        calendar: null,
        userId: new Types.ObjectId('62b276fda78b2a00063b1de0'),
      };

      const invalid = plainToInstance(SettingsCreateDTO, validDiscussionId);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('calendar must be a mongodb id');
    });

    //valid discussion id, empty object
    it('should throw a 400 for an empty object', async () => {
      const invalidDiscussion = {};

      const invalid = plainToInstance(SettingsCreateDTO, invalidDiscussion);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('calendar should not be empty');
      expect(JSON.stringify(errors)).toContain('prompt should not be empty');
      expect(JSON.stringify(errors)).toContain(
        'post_inspiration should not be empty',
      );
      expect(JSON.stringify(errors)).toContain('score should not be empty');
      expect(JSON.stringify(errors)).toContain('calendar should not be empty');
    });
  });

  // add 404 status errors for settings checks agains mongoo db
  //404 error status
  describe('PATCH /discussion/:discussionId/setting 404 status', () => {
    it('should throw a 404 for non-existent Discussion Id not found for Setting', () => {
      const non_existentDiscussionId = {
        id: new Types.ObjectId('62b276fda78b2a00063b1de4'),
        starter_prompt: 'This is a prompt',
        post_inspiration: [new Types.ObjectId('62b276fda78b2a00063b1de2')],
        score: new Types.ObjectId('62b276fda78b2a00063b1de3'),
        calendar: new Types.ObjectId('62b276fda78b2a00063b1de4'),
        userId: new Types.ObjectId('62b276fda78b2a00063b1de0'),
      };
      const error = new HttpException(
        'Discussion Id does not exist',
        HttpStatus.NOT_FOUND,
      );
      return expect(
        appController.updateDiscussionSettings(
          non_existentDiscussionId,
          '62b276fda78b2a00063b1de4',
        ),
      ).rejects.toThrow(error);
    });

    it('should throw a 404 error for a post inspiration not found', () => {
      const validDiscussion = {
        id: new Types.ObjectId('62b276fda78b2a00063b1de1'),
        starter_prompt: 'This is a prompt',
        post_inspiration: [undefined],
        score: new Types.ObjectId('62b276fda78b2a00063b1de3'),
        calendar: new Types.ObjectId('62b276fda78b2a00063b1de4'),
        userId: new Types.ObjectId('62b276fda78b2a00063b1de0'),
      };
      const error = new HttpException(
        'Post inspiration Id does not exist',
        HttpStatus.NOT_FOUND,
      );
      return expect(
        appController.updateDiscussionSettings(
          validDiscussion,
          '62b276fda78b2a00063b1de0',
        ),
      ).rejects.toThrow(error);
    });

    it('should throw a 404 error for a score id not found for setting', () => {
      const validDiscussion = {
        id: new Types.ObjectId('62b276fda78b2a00063b1de1'),
        starter_prompt: 'This is a prompt',
        post_inspiration: [new Types.ObjectId('62b276fda78b2a00063b1de2')],
        score: undefined,
        calendar: new Types.ObjectId('62b276fda78b2a00063b1de4'),
        userId: new Types.ObjectId('62b276fda78b2a00063b1de0'),
      };
      const error = new HttpException(
        'Score Id does not exist',
        HttpStatus.NOT_FOUND,
      );
      return expect(
        appController.updateDiscussionSettings(
          validDiscussion,
          '62b276fda78b2a00063b1de0',
        ),
      ).rejects.toThrow(error);
    });

    it('should throw a 404 error for a calendar id not found for setting', () => {
      const validDiscussion = {
        id: new Types.ObjectId('62b276fda78b2a00063b1de1'),
        starter_prompt: 'This is a prompt',
        post_inspiration: [new Types.ObjectId('62b276fda78b2a00063b1de2')],
        score: new Types.ObjectId('62b276fda78b2a00063b1de3'),
        calendar: null,
        userId: new Types.ObjectId('62b276fda78b2a00063b1de0'),
      };
      const error = new HttpException(
        'Calendar Id does not exist',
        HttpStatus.NOT_FOUND,
      );
      return expect(
        appController.updateDiscussionSettings(
          validDiscussion,
          '62b276fda78b2a00063b1de0',
        ),
      ).rejects.toThrow(error);
    });
  });

  //mute discussion 200 ok response
  describe('PATCH /users/:userId/discussions/:discussionId/mute', () => {
    it('should return valid ParticipantID added', () => {
      return expect(
        appController.muteUserInDiscussion(
          '62b276fda78b2a00063b1de0',
          '62b276fda78b2a00063b1de0',
        ),
      ).resolves.not.toThrow();
    });
  });

  //400 status for participant
  describe('PATCH /users/:userId/discussions/:discussionId/mute', () => {
    it('should return valid Discussion Id', () => {
      const validParticipantId = {
        user: new Types.ObjectId('62b276fda78b2a00063b1de1'),
        joined: new Date(),
        muted: Boolean,
        grade: null,
      };
      return expect(
        appController.muteUserInDiscussion(
          '62b276fda78b2a00063b1de0',
          '62b276fda78b2a00063b1de0',
        ),
      ).resolves.not.toThrow();
    });
  });

  //401 error - user not logged in to be done

  //403 error- mute discussion
  describe('PATCH /users/:userId/discussions/:discussionId/mute', () => {
    it('throw a 403 error for user not a participant or a facilitator', () => {
      const validParticipantId = {
        user: new Types.ObjectId('62b276fda78b2a00063b1de1'),
        joined: new Date(),
        muted: Boolean,
        grade: null,
      };
      const error = new HttpException(
        'User is not a participant or a facilitator of the discussion',
        HttpStatus.FORBIDDEN,
      );
      return expect(
        appController.muteUserInDiscussion(
          '62b276fda78b2a00063b1de1',
          '62b276fda78b2a00063b1de0',
        ),
      ).rejects.toThrow(error);
    });
  });

  //404 error- mute discussion
  describe('PATCH /users/:userId/discussions/:discussionId/mute', () => {
    it('throw a 404 error for user or discussion not found', () => {
      const validParticipantId = {
        user: new Types.ObjectId('62b276fda78b2a00063b1de1'),
        joined: new Date(),
        muted: Boolean,
        grade: null,
      };
      const error = new HttpException(
        'User or discussion trying to mute does not exist',
        HttpStatus.NOT_FOUND,
      );
      return expect(
        appController.muteUserInDiscussion(
          '62b276fda78b2a00063b1de0',
          '62b276fda78b2a00063b1de0',
        ),
      ).rejects.toThrow(error);
    });
  });

  afterAll((done) => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoConnection.close();
    done();
  });
});
