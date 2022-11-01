import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { GradeController } from './grade.controller';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Model, Connection } from 'mongoose';
import {
  Discussion,
  DiscussionSchema,
} from 'src/entities/discussion/discussion';
import { Grade, GradeSchema } from 'src/entities/grade/grade';
import { GradeService } from './grade.service';
import { NotificationService } from 'src/modules/notification/notification.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IsDiscussionFacilitatorGuard } from 'src/auth/guards/userGuards/isDiscussionFacilitator.guard';

describe('GradeController', () => {
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let gradeController: GradeController;
  let discussionModel: Model<any>;
  let gradeModel: Model<any>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    discussionModel = mongoConnection.model(Discussion.name, DiscussionSchema);
    gradeModel = mongoConnection.model(Grade.name, GradeSchema);
  });
  beforeEach(async () => {
    const mockGradeService = {
      addEventForAutoGrading: jest.fn(),
      updateEventForAutoGrading: jest.fn(),
      gradeDiscussion: jest.fn(),
    };

    const mockNotificationService = {
      sendNotification: jest.fn(),
    };
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

  // TODO: GradeController & GradeService tests
  describe('createGradeForParticipant (PATCH /discussions/:discussionId/participants/:participantId/grade)', () => {
    describe('200 OK', () => {
      it('should return the updated grade', () => {
        expect(true).toBeFalsy();
      });

      it('should create notification for participant', () => {
        expect(true).toBeFalsy();
      });
    });

    describe('404 NOT FOUND', () => {
      it('should return an error if the discussion does not exist', () => {
        expect(true).toBeFalsy();
      });
    });

    describe('400 BAD REQUEST', () => {
      it('should return an error if the participant is not a part of the discussion', () => {
        expect(true).toBeFalsy();
      });

      it('should return an error if the grade does not have the same number of criteria as the discussion', () => {
        expect(true).toBeFalsy();
      });
    });
  });

  describe('autoGradeParticipants (PATCH /discussion/:discussionId/participants/autograde)', () => {
    describe('200 OK', () => {
      it('should use gradeSerivce to gradeDisucssion', () => {
        expect(true).toBeFalsy();
      });
    });

    describe('400 BAD REQUEST', () => {
      it('invalid discussionId', async () => {
        await expect(
          gradeController.autoGradeParticipants('invalidId'),
        ).rejects.toThrowError('DiscussionId is not valid');
      });
    });
  });
});
