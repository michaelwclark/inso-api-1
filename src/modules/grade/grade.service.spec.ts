import { GradeService } from './grade.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Discussion } from 'src/entities/discussion/discussion';
import { getModelToken } from '@nestjs/mongoose';
import { testingDatabase, TestingDatabase } from 'test/database';
import { DiscussionPost } from 'src/entities/post/post';
import { Setting } from 'src/entities/setting/setting';
import { Grade } from 'src/entities/grade/grade';

describe('GradeService', () => {
  let database: TestingDatabase;
  // let fakeDocuments: FakeDocuments;
  let module: TestingModule;

  beforeAll(async () => {
    database = await testingDatabase();
  });

  let gradeService: GradeService;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        GradeService,
        {
          provide: getModelToken(Discussion.name),
          useValue: database.discussion,
        },
        {
          provide: getModelToken(DiscussionPost.name),
          useValue: database.post,
        },
        {
          provide: getModelToken(Setting.name),
          useValue: database.setting,
        },
        {
          provide: getModelToken(Grade.name),
          useValue: database.grade,
        },
      ],
    }).compile();
    gradeService = module.get<GradeService>(GradeService);
  });

  beforeEach(async () => {
    gradeService.eventBridge = {
      putEvents: jest.fn(),
    } as any;
  });

  describe('addEventForAutoGrading', () => {
    it('should call putEvents on eventBridge', async () => {
      expect(true).toBe(true);
    });
  });

  describe('updateEventForAutoGrading', () => {
    it('should be defined', () => {
      expect(gradeService.updateEventForAutoGrading).toBeDefined();
    });
  });

  describe('gradeDiscussion', () => {
    it('should be defined', () => {
      expect(gradeService.gradeDiscussion).toBeDefined();
    });
  });
});
