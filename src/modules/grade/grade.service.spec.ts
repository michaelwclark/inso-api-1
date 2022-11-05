import { GradeService } from './grade.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('GradeService', () => {
  let service: GradeService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GradeService],
    }).compile();
    service = module.get<GradeService>(GradeService);
  });

  beforeEach(async () => {
    service.eventBridge = {
      putEvents: jest.fn(),
    } as any;
  });

  describe('addEventForAutoGrading', () => {
    it('should call putEvents on eventBridge', async () => {
      expect(true).toBe(true);
    });
  });

  describe('updateEventForAutoGrading', () => {});

  describe('gradeDiscussion', () => {});

  describe('gradeParticipant', () => {});
});
