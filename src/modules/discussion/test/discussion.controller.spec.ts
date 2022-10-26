import { HttpException, HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { HydratedDocument } from 'mongoose';
import { connect, Connection, Model, Types } from 'mongoose';
import { IsDiscussionCreatorGuard } from 'src/auth/guards/userGuards/isDiscussionCreator.guard';
import { IsDiscussionFacilitatorGuard } from 'src/auth/guards/userGuards/isDiscussionFacilitator.guard';
import { IsDiscussionMemberGuard } from 'src/auth/guards/userGuards/isDiscussionMember.guard';
import { Calendar, CalendarSchema } from 'src/entities/calendar/calendar';
import { makeFakeCalendarPayload } from 'src/entities/calendar/calendar-fakes';
import {
  makeFakeSettingPayload,
  makeFakeSettingsCreateDTO,
} from 'src/entities/setting/setting-fakes';
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
import { Reaction, ReactionSchema } from 'src/entities/reaction/reaction';
import { Grade, GradeSchema } from 'src/entities/grade/grade';
import { MilestoneService } from 'src/modules/milestone/milestone.service';
import { makeFakeUserPayload } from 'src/entities/user/user-fakes';
import { makeFakeInspirationPayload } from 'src/entities/inspiration/inspiration-fakes';
import { makeFakeScorePayload } from 'src/entities/score/score-fakes';
import {
  makeFakeDiscussionCreateDTO,
  makeFakeDiscussionPayload,
} from 'src/entities/discussion/discussion-fakes';
import faker from 'test/faker';

describe('DiscussionController', () => {
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
  let reactionModel: Model<any>;
  let gradeModel: Model<any>;
  let user: HydratedDocument<User>;
  let calendar: HydratedDocument<Calendar>;
  let inspiration: HydratedDocument<Inspiration>;
  let score: HydratedDocument<Score>;
  let setting: HydratedDocument<Setting>;
  let discussionA: HydratedDocument<Discussion>;
  let discussionB: HydratedDocument<Discussion>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    discussionModel = mongoConnection.model(Discussion.name, DiscussionSchema);
    settingModel = mongoConnection.model(Setting.name, SettingSchema);
    scoreModel = mongoConnection.model(Score.name, ScoreSchema);

    inspirationModel = mongoConnection.model(
      Inspiration.name,
      InspirationSchema,
    );
    userModel = mongoConnection.model(User.name, UserSchema);
    calendarModel = mongoConnection.model(Calendar.name, CalendarSchema);
    postModel = mongoConnection.model(
      DiscussionPost.name,
      DiscussionPostSchema,
    );

    reactionModel = mongoConnection.model(Reaction.name, ReactionSchema);
    gradeModel = mongoConnection.model(Grade.name, GradeSchema);
  });

  const mockMilestoneService = {
    getMilestoneForUser: jest.fn(),
    createMilestoneForUser: jest.fn(),
  };

  beforeEach(async () => {
    user = await userModel.create(makeFakeUserPayload());
    calendar = await calendarModel.create(makeFakeCalendarPayload());
    inspiration = await inspirationModel.create(makeFakeInspirationPayload());
    score = await scoreModel.create(makeFakeScorePayload());

    setting = await settingModel.create(
      makeFakeSettingPayload({
        userId: user._id,
        calendar: calendar._id,
        post_inspirations: [inspiration._id],
        score: score._id,
      }),
    );
    discussionA = await discussionModel.create(
      makeFakeDiscussionPayload({
        archived: null,
        settings: setting._id,
        participants: [
          {
            user: user._id,
            joined: faker.date.past(),
            muted: faker.datatype.boolean(),
            grade: faker.database.fakeMongoId(),
          },
        ],
      }),
    );

    discussionB = await discussionModel.create(
      makeFakeDiscussionPayload({
        archived: null,
        settings: setting._id,
      }),
    );

    const app: TestingModule = await Test.createTestingModule({
      controllers: [DiscussionController],
      providers: [
        { provide: getModelToken(Discussion.name), useValue: discussionModel },
        { provide: getModelToken(Setting.name), useValue: settingModel },
        { provide: getModelToken(Score.name), useValue: scoreModel },
        {
          provide: getModelToken(Inspiration.name),
          useValue: inspirationModel,
        },
        { provide: getModelToken(User.name), useValue: userModel },
        { provide: getModelToken(Calendar.name), useValue: calendarModel },
        { provide: getModelToken(DiscussionPost.name), useValue: postModel },
        { provide: getModelToken(Reaction.name), useValue: reactionModel },
        { provide: getModelToken(Grade.name), useValue: gradeModel },
        {
          provide: MilestoneService,
          useValue: mockMilestoneService,
        },
      ],
    })
      .overrideGuard(IsDiscussionCreatorGuard)
      .useValue({
        canActivate: () => true,
      })
      .overrideGuard(IsDiscussionMemberGuard)
      .useValue({
        canActivate: () => true,
      })
      .overrideGuard(IsDiscussionFacilitatorGuard)
      .useValue({
        canActivate: () => true,
      })
      .compile();

    appController = app.get<DiscussionController>(DiscussionController);
  });

  afterEach(async () => {
    await discussionModel.deleteMany({});
    await settingModel.deleteMany({});
    await scoreModel.deleteMany({});
    await inspirationModel.deleteMany({});
    await userModel.deleteMany({});
    await calendarModel.deleteMany({});
    await postModel.deleteMany({});
    await reactionModel.deleteMany({});
    await gradeModel.deleteMany({});
  });

  describe('createDiscussion (POST /discussion)', () => {
    it('should throw an error if the user is not found', async () => {
      return;
    });

    it('should throw an error if request user does not match create user', async () => {
      return;
    });

    it('should throw an error if any facilitator users do not exist', async () => {
      return;
    });

    it('should create discussion with unique new insoID', async () => {
      return;
    });

    it('should create a discussion and discussion setting with inspirations', async () => {
      return;
    });

    it('should create milestone for Discussion Created if it does not exist for user', async () => {
      return;
    });

    it('should not create milestone for Discussion Created if it does exist for user', async () => {
      return;
    });

    it('should create and return a valid discussion', () => {
      const discussionDTO = makeFakeDiscussionCreateDTO({
        poster: user._id,
        facilitators: [user._id],
      });

      const mockRequest = {
        user: {
          userId: user._id,
          username: user.username,
        },
      };

      return expect(
        appController.createDiscussion(discussionDTO, mockRequest),
      ).resolves.toMatchObject(discussionDTO);
    });

    describe('POST /discussion 400 Errors', () => {
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
          poster: user._id,
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
          poster: user._id,
        };

        const invalid = plainToInstance(DiscussionCreateDTO, invalidDiscussion);
        const errors = await validate(invalid);
        expect(errors.length).not.toBe(0);
        expect(JSON.stringify(errors)).toContain('name should not be empty');
      });

      it('should throw a 400 for an null name', async () => {
        const invalidDiscussion = {
          name: null,
          poster: user._id,
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

    describe('POST /discussion 404 Errors', () => {
      it('throw a 404 error for poster not found', () => {
        const validDiscussion = {
          name: 'Power',
          poster: new Types.ObjectId(),
          facilitators: [],
        };

        const reqUser = {
          userId: user._id,
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
          poster: user._id,
          facilitators: [new Types.ObjectId()],
        };
        const reqUser = {
          userId: user._id,
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
  });

  describe('updateDiscussionMetadata (PATCH discussion/:discussionId/metadata)', () => {
    it('should throw an error if the discussion is not found', async () => {
      return;
    });

    it('should throw an error if any facilitator users do not exist', async () => {
      return;
    });

    it('should throw an error if participants on payload', async () => {
      return;
    });
  });

  //200 status valid for setting here
  describe('PATCH /discussion/:discussionId/settings 200 Status', () => {
    it('should return valid Discussion Id', () => {
      const settingsCreateDTO = makeFakeSettingsCreateDTO({
        score: score._id,
        calendar: calendar._id,
        post_inspirations: [inspiration._id],
      });
      return expect(
        appController.updateDiscussionSettings(
          settingsCreateDTO,
          discussionA._id.toString(),
        ),
      ).resolves.not.toThrow();
    });
  });

  //200 status for participant
  describe('PATCH /users/:userId/discussions/:discussionId/join', () => {
    it('should throw error if inso code is invalid', async () => {
      await expect(
        appController.joinDiscussion(
          user._id.toString(),
          faker.datatype.string(6),
        ),
      ).rejects.toThrowError(
        new HttpException('InsoCode not valid', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw error if userId is not valid ObjectId', async () => {
      await expect(
        appController.joinDiscussion(
          faker.datatype.string(6),
          discussionA.insoCode,
        ),
      ).rejects.toThrowError(
        new HttpException('UserId is not valid', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw error if user is not found', async () => {
      await expect(
        appController.joinDiscussion(
          faker.database.mongodbObjectId(),
          discussionA.insoCode,
        ),
      ).rejects.toThrowError(
        new HttpException('UserId not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw error if discussion is not found', async () => {
      await expect(
        appController.joinDiscussion(
          user._id.toString(),
          faker.datatype.string(5),
        ),
      ).rejects.toThrowError(
        new HttpException('Discussion is not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw error if user is already a participant', async () => {
      await expect(
        appController.joinDiscussion(user._id.toString(), discussionA.insoCode),
      ).rejects.toThrowError(
        new HttpException('User is already a participant', HttpStatus.CONFLICT),
      );
    });

    it('should add user to discussion as participant', async () => {
      const results = await appController.joinDiscussion(
        user._id.toString(),
        discussionB.insoCode,
      );

      expect(results.participants).toContainEqual({
        user: user._id,
        joined: expect.any(Date),
        muted: false,
        grade: null,
      });
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
        userId: user._id,
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
        userId: user._id,
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
        userId: user._id,
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
        userId: user._id,
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
      const settingsCreateDTO = makeFakeSettingsCreateDTO();
      const nonExistantDiscussionId = faker.database.mongodbObjectId();
      const error = new HttpException(
        'Discussion Id does not exist',
        HttpStatus.NOT_FOUND,
      );
      return expect(
        appController.updateDiscussionSettings(
          settingsCreateDTO,
          nonExistantDiscussionId,
        ),
      ).rejects.toThrow(error);
    });

    it('should throw a 404 error for a post inspiration not found', () => {
      const validDiscussion = plainToInstance(SettingsCreateDTO, {
        id: new Types.ObjectId('62b276fda78b2a00063b1de1'),
        starter_prompt: 'This is a prompt',
        post_inspiration: [undefined],
        score: new Types.ObjectId('62b276fda78b2a00063b1de3'),
        calendar: new Types.ObjectId('62b276fda78b2a00063b1de4'),
        userId: user._id,
      });
      const error = new HttpException(
        'Post inspiration Id does not exist',
        HttpStatus.NOT_FOUND,
      );
      return expect(
        appController.updateDiscussionSettings(
          validDiscussion,
          user._id.toString(),
        ),
      ).rejects.toThrow(error);
    });

    it('should throw a 404 error for a score id not found for setting', () => {
      const validDiscussion = plainToInstance(SettingsCreateDTO, {
        id: new Types.ObjectId('62b276fda78b2a00063b1de1'),
        starter_prompt: 'This is a prompt',
        post_inspiration: [new Types.ObjectId('62b276fda78b2a00063b1de2')],
        score: undefined,
        calendar: new Types.ObjectId('62b276fda78b2a00063b1de4'),
        userId: user._id,
      });
      const error = new HttpException(
        'Score Id does not exist',
        HttpStatus.NOT_FOUND,
      );
      return expect(
        appController.updateDiscussionSettings(
          validDiscussion,
          user._id.toString(),
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
        userId: user._id,
      };
      const error = new HttpException(
        'Calendar Id does not exist',
        HttpStatus.NOT_FOUND,
      );
      return expect(
        appController.updateDiscussionSettings(
          plainToInstance(SettingsCreateDTO, validDiscussion),
          user._id.toString(),
        ),
      ).rejects.toThrow(error);
    });
  });

  //mute discussion 200 ok response
  describe('PATCH /users/:userId/discussions/:discussionId/mute', () => {
    it('should return valid ParticipantID added', () => {
      return expect(
        appController.muteUserInDiscussion(
          user._id.toString(),
          user._id.toString(),
        ),
      ).resolves.not.toThrow();
    });
  });

  //400 status for participant
  describe('PATCH /users/:userId/discussions/:discussionId/mute', () => {
    it('should return valid Discussion Id', () => {
      return expect(
        appController.muteUserInDiscussion(
          user._id.toString(),
          user._id.toString(),
        ),
      ).resolves.not.toThrow();
    });
  });

  //401 error - user not logged in to be done

  //403 error- mute discussion
  describe('PATCH /users/:userId/discussions/:discussionId/mute', () => {
    it('throw a 403 error for user not a participant or a facilitator', () => {
      const error = new HttpException(
        'User is not a participant or a facilitator of the discussion',
        HttpStatus.FORBIDDEN,
      );
      return expect(
        appController.muteUserInDiscussion(
          '62b276fda78b2a00063b1de1',
          user._id.toString(),
        ),
      ).rejects.toThrow(error);
    });
  });

  //404 error- mute discussion
  describe('PATCH /users/:userId/discussions/:discussionId/mute', () => {
    it('throw a 404 error for user or discussion not found', () => {
      const error = new HttpException(
        'User or discussion trying to mute does not exist',
        HttpStatus.NOT_FOUND,
      );
      return expect(
        appController.muteUserInDiscussion(
          user._id.toString(),
          user._id.toString(),
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
