import { Test, TestingModule } from '@nestjs/testing';
import { ReactionController } from './reaction.controller';

describe('AppController', () => {
  let appController: ReactionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ReactionController],
      providers: [],
    }).compile();

    appController = app.get<ReactionController>(ReactionController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});