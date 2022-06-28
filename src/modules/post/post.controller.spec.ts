import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';

describe('AppController', () => {
  let appController: PostController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [],
    }).compile();

    appController = app.get<PostController>(PostController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      //expect(appController.getHello()).toBe('Hello World!');
    });
  });
});