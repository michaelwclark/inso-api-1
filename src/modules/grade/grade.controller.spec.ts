import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { GradeController } from './grade.controller';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Model, Connection } from 'mongoose';
import { Grade, GradeSchema } from 'src/entities/grade/grade';
import { HydratedDocument } from 'mongoose';
import { GradeService } from './grade.service';
import { NotificationService } from 'src/modules/notification/notification.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IsDiscussionFacilitatorGuard } from 'src/auth/guards/userGuards/isDiscussionFacilitator.guard';
import {
  Discussion,
  DiscussionSchema,
} from 'src/entities/discussion/discussion';
import {
  Inspiration,
  InspirationSchema,
} from 'src/entities/inspiration/inspiration';
import { Score, ScoreSchema } from 'src/entities/score/score';
import { Setting, SettingSchema } from 'src/entities/setting/setting';
import { User, UserSchema } from 'src/entities/user/user';
import { Calendar, CalendarSchema } from 'src/entities/calendar/calendar';
import { makeFakeUserPayload } from 'src/entities/user/user-fakes';
import { makeFakeInspirationPayload } from 'src/entities/inspiration/inspiration-fakes';
import { makeFakeScorePayload } from 'src/entities/score/score-fakes';
import { makeFakeCalendarPayload } from 'src/entities/calendar/calendar-fakes';
import { makeFakeSettingPayload } from 'src/entities/setting/setting-fakes';
import { makeFakeDiscussionPayload } from 'src/entities/discussion/discussion-fakes';
import faker from 'test/faker';
import { makeFakeGradeDTO } from 'src/entities/grade/grade-fakes';
import GRADE_ERRORS from './grade-errors';

describe('GradeController', () => {
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let gradeController: GradeController;
  let discussionModel: Model<any>;
  let userModel: Model<any>;
  let settingModel: Model<any>;
  let scoreModel: Model<any>;
  let inspirationModel: Model<any>;
  let calendarModel: Model<any>;
  // let postModel: Model<any>;
  // let reactionModel: Model<any>;
  let grade: HydratedDocument<Grade>;
  let gradeModel: Model<any>;
  let user: HydratedDocument<User>;
  let calendar: HydratedDocument<Calendar>;
  let inspiration: HydratedDocument<Inspiration>;
  let score: HydratedDocument<Score>;
  let setting: HydratedDocument<Setting>;
  let discussionA: HydratedDocument<Discussion>;
  let mockRequest: any;
  const mockGradeService = {
    addEventForAutoGrading: jest.fn(),
    updateEventForAutoGrading: jest.fn(),
    gradeDiscussion: jest.fn(),
  };

  const mockNotificationService = {
    createNotification: jest.fn(),
  };
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
    gradeModel = mongoConnection.model(Grade.name, GradeSchema);
  });

  beforeEach(async () => {
    user = await userModel.create(makeFakeUserPayload());
    calendar = await calendarModel.create(makeFakeCalendarPayload());
    inspiration = await inspirationModel.create(makeFakeInspirationPayload());
    grade = await gradeModel.create(makeFakeGradeDTO());
    score = await scoreModel.create(
      makeFakeScorePayload({
        criteria: [
          {
            max_points: 5,
            criteria: 'Criteria 1',
          },
          {
            max_points: 5,
            criteria: 'Criteria 2',
          },
        ],
      }),
    );
    mockRequest = {
      user: {
        userId: user._id,
        username: user.username,
      },
    };
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
        poster: user._id,
        participants: [
          {
            user: user._id,
            joined: faker.date.past(),
            muted: faker.datatype.boolean(),
            grade: grade._id,
          },
        ],
      }),
    );

    const app: TestingModule = await Test.createTestingModule({
      controllers: [GradeController],
      providers: [
        {
          provide: getModelToken(Discussion.name),
          useValue: discussionModel,
        },
        {
          provide: getModelToken(Grade.name),
          useValue: gradeModel,
        },
        {
          provide: GradeService,
          useValue: mockGradeService,
        },
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: () => true,
      })
      .overrideGuard(IsDiscussionFacilitatorGuard)
      .useValue({
        canActivate: () => true,
      })
      .compile();
    gradeController = app.get<GradeController>(GradeController);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  // TODO: GradeController & GradeService tests
  describe('createGradeForParticipant (PATCH /discussions/:discussionId/participants/:participantId/grade)', () => {
    describe('200 OK', () => {
      it('should return the updated grade', async () => {
        const gradeDTO = makeFakeGradeDTO({
          total: 10,
          criteria: [
            {
              criteria: 'Criteria 1',
              max_points: 5,
              earned: 5,
            },
            {
              criteria: 'Criteria 2',
              max_points: 5,
              earned: 5,
            },
          ],
        });

        const result = await gradeController.createGradeForParticipant(
          discussionA._id.toString(),
          user._id.toString(),
          gradeDTO,
          mockRequest,
        );

        expect(result).toMatchObject({
          _id: grade._id,
          rubric: [gradeDTO.criteria[0], gradeDTO.criteria[1]],
          comment: gradeDTO.comments,
          discussionId: discussionA._id,
          facilitator: mockRequest.user.userId,
          grade: gradeDTO.total,
          maxScore: score.total,
          userId: user._id,
        });
      });

      it('should create notification for participant', async () => {
        const gradeDTO = makeFakeGradeDTO({
          total: 10,
          criteria: [
            {
              criteria: 'Criteria 1',
              max_points: 5,
              earned: 5,
            },
            {
              criteria: 'Criteria 2',
              max_points: 5,
              earned: 5,
            },
          ],
        });

        await gradeController.createGradeForParticipant(
          discussionA._id.toString(),
          user._id.toString(),
          gradeDTO,
          mockRequest,
        );

        expect(mockNotificationService.createNotification).toBeCalledWith(
          user._id,
          mockRequest.user.userId,
          {
            header: expect.any(String),
            text: expect.any(String),
            type: expect.any(String),
          },
        );
      });

      it('should create a grade for participant if one does not exist', async () => {
        const participant = await userModel.create(makeFakeUserPayload());
        const discussion = await discussionModel.create({
          ...makeFakeDiscussionPayload({
            archived: null,
            settings: setting._id,
            poster: user._id,
            participants: [
              {
                user: participant._id,
                joined: faker.date.past(),
                muted: faker.datatype.boolean(),
                grade: null,
              },
            ],
          }),
        });
        const gradeDTO = makeFakeGradeDTO({
          total: 10,
          criteria: [
            {
              criteria: 'Criteria 1',
              max_points: 5,
              earned: 5,
            },
            {
              criteria: 'Criteria 2',
              max_points: 5,
              earned: 5,
            },
          ],
        });
        const countBefore = await gradeModel.countDocuments();
        await gradeController.createGradeForParticipant(
          discussion._id.toString(),
          participant._id.toString(),
          gradeDTO,
          mockRequest,
        );
        const countAfter = await gradeModel.countDocuments();

        expect(countAfter).toBe(countBefore + 1);
      });
    });

    describe('404 NOT FOUND', () => {
      it('should return an error if the discussion does not exist', () => {
        return expect(
          gradeController.createGradeForParticipant(
            faker.database.mongodbObjectId(),

            user._id.toString(),
            makeFakeGradeDTO(),
            mockRequest,
          ),
        ).rejects.toThrowError(GRADE_ERRORS.DISCUSSION_NOT_FOUND);
      });
    });

    describe('400 BAD REQUEST', () => {
      it('should return an error if the participant is not a part of the discussion', () => {
        return expect(
          gradeController.createGradeForParticipant(
            discussionA._id.toString(),
            faker.database.mongodbObjectId(),
            makeFakeGradeDTO(),
            mockRequest,
          ),
        ).rejects.toThrowError(GRADE_ERRORS.PARTICIPANT_NOT_FOUND);
      });

      it('should return an error if the grade does not have the same number of criteria as the discussion', () => {
        return expect(
          gradeController.createGradeForParticipant(
            discussionA._id.toString(),
            user._id.toString(),
            makeFakeGradeDTO({
              total: 5,
              criteria: [
                {
                  criteria: 'Criteria 1',
                  max_points: 5,
                  earned: 5,
                },
              ],
            }),
            mockRequest,
          ),
        ).rejects.toThrowError(GRADE_ERRORS.CRITERIAN_NOT_INCLUDED);
      });
    });
  });

  describe('autoGradeParticipants (PATCH /discussion/:discussionId/participants/autograde)', () => {
    describe('200 OK', () => {
      it('should use gradeSerivce to gradeDisucssion', () => {
        gradeController.autoGradeParticipants(discussionA._id.toString());

        expect(mockGradeService.gradeDiscussion).toBeCalledWith(
          discussionA._id.toString(),
        );
      });
    });

    describe('400 BAD REQUEST', () => {
      it('invalid discussionId', async () => {
        await expect(
          gradeController.autoGradeParticipants('invalidId'),
        ).rejects.toThrowError('Discussion Id is not valid');
      });
    });
  });
});
