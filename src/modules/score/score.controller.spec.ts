import { Test, TestingModule } from '@nestjs/testing';
import { ScoreController } from './score.controller';

describe('AppController', () => {
  let appController: ScoreController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ScoreController],
      providers: [],
    }).compile();

    appController = app.get<ScoreController>(ScoreController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // expect(appController.getHello()).toBe('Hello World!');
    });
  });
});