import { Test, TestingModule } from '@nestjs/testing';
import { DiscussionController } from './discussion.controller';

describe('AppController', () => {
  let appController: DiscussionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DiscussionController],
      providers: [],
    }).compile();

    appController = app.get<DiscussionController>(DiscussionController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});