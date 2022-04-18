import { Test, TestingModule } from '@nestjs/testing';
import { GradeController } from './grade.controller';

describe('AppController', () => {
  let appController: GradeController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GradeController],
      providers: [],
    }).compile();

    appController = app.get<GradeController>(GradeController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});