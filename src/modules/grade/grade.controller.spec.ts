// import { Test, TestingModule } from '@nestjs/testing';
// import { GradeController } from './grade.controller';

describe('GradeController', () => {
  // let appController: GradeController;

  beforeEach(async () => {
    // const app: TestingModule = await Test.createTestingModule({
    //   controllers: [GradeController],
    //   providers: [],
    // }).compile();
    // appController = app.get<GradeController>(GradeController);
  });

  describe('PATCH /discussions/:discussionId/participants/:participantId/grade', () => {
    it('should return a 200 for an updated grad"', () => {});
    it('should return a 200 for a newly created grade', () => {});
    it('should return a 400 for an incorrectly formatted grade', () => {});
    it("should return a 400 if the participant isn't in the discussion", () => {});
    it('should return a 400 if not all criteria is included in the grade', () => {});
    it('should return a 400 if not all criteria earned points does not equal the total', () => {});
    it('should return a 401 if the user token is not valid', () => {});
    it('should return a 403 if the requester is not a facilitator in the discussion', () => {});
    it('should return a 404 if the discussion is not found', () => {});
  });
});
