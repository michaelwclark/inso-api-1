import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { GradeController } from './grade.controller';
import { Grade } from 'src/entities/grade/grade';
import { GradeService } from './grade.service';
import { NotificationService } from 'src/modules/notification/notification.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IsDiscussionFacilitatorGuard } from 'src/auth/guards/userGuards/isDiscussionFacilitator.guard';
import { Discussion } from 'src/entities/discussion/discussion';
import { makeFakeUserPayload } from 'src/entities/user/user-fakes';
import { makeFakeDiscussionPayload } from 'src/entities/discussion/discussion-fakes';
import faker from 'test/faker';
import { makeFakeGradeDTO } from 'src/entities/grade/grade-fakes';
import GRADE_ERRORS from './grade-errors';
import { TestingDatabase, FakeDocuments, testingDatabase } from 'test/database';

describe('GradeController', () => {
  let database: TestingDatabase;
  let gradeController: GradeController;
  let mockRequest: any;
  let fakeDocuments: FakeDocuments;
  const mockGradeService = {
    addEventForAutoGrading: jest.fn(),
    updateEventForAutoGrading: jest.fn(),
    gradeDiscussion: jest.fn(),
  };

  const mockNotificationService = {
    createNotification: jest.fn(),
  };

  beforeAll(async () => {
    database = await testingDatabase();
  });

  beforeEach(async () => {
    fakeDocuments = await database.createFakes();
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GradeController],
      providers: [
        {
          provide: getModelToken(Discussion.name),
          useValue: database.discussion,
        },
        {
          provide: getModelToken(Grade.name),
          useValue: database.grade,
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
    mockRequest = {
      user: {
        userId: fakeDocuments.user._id,
        username: fakeDocuments.user.username,
      },
    };
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await database.clearDatabase();
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
          fakeDocuments.discussion._id.toString(),
          fakeDocuments.user._id.toString(),
          gradeDTO,
          mockRequest,
        );

        expect(result).toMatchObject({
          _id: fakeDocuments.grade._id,
          rubric: [gradeDTO.criteria[0], gradeDTO.criteria[1]],
          comment: gradeDTO.comments,
          discussionId: fakeDocuments.discussion._id,
          facilitator: mockRequest.user.userId,
          grade: gradeDTO.total,
          maxScore: fakeDocuments.score.total,
          userId: fakeDocuments.user._id,
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
          fakeDocuments.discussion._id.toString(),
          fakeDocuments.user._id.toString(),
          gradeDTO,
          mockRequest,
        );

        expect(mockNotificationService.createNotification).toBeCalledWith(
          fakeDocuments.user._id,
          mockRequest.user.userId,
          {
            header: expect.any(String),
            text: expect.any(String),
            type: expect.any(String),
          },
        );
      });

      it('should create a grade for participant if one does not exist', async () => {
        const participant = await database.user.create(makeFakeUserPayload());
        const discussion = await database.discussion.create({
          ...makeFakeDiscussionPayload({
            archived: null,
            settings: fakeDocuments.setting._id,
            poster: fakeDocuments.user._id,
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
        const countBefore = await database.grade.countDocuments();
        await gradeController.createGradeForParticipant(
          discussion._id.toString(),
          participant._id.toString(),
          gradeDTO,
          mockRequest,
        );
        const countAfter = await database.grade.countDocuments();

        expect(countAfter).toBe(countBefore + 1);
      });
    });

    describe('404 NOT FOUND', () => {
      it('should return an error if the discussion does not exist', () => {
        return expect(
          gradeController.createGradeForParticipant(
            faker.database.mongoObjectIdString(),

            fakeDocuments.user._id.toString(),
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
            fakeDocuments.discussion._id.toString(),
            faker.database.mongoObjectIdString(),
            makeFakeGradeDTO(),
            mockRequest,
          ),
        ).rejects.toThrowError(GRADE_ERRORS.PARTICIPANT_NOT_FOUND);
      });

      it('should return an error if the grade does not have the same number of criteria as the discussion', () => {
        return expect(
          gradeController.createGradeForParticipant(
            fakeDocuments.discussion._id.toString(),
            fakeDocuments.user._id.toString(),
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
        gradeController.autoGradeParticipants(
          fakeDocuments.discussion._id.toString(),
        );

        expect(mockGradeService.gradeDiscussion).toBeCalledWith(
          fakeDocuments.discussion._id.toString(),
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
