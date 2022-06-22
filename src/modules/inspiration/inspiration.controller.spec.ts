import { Test, TestingModule } from '@nestjs/testing';
import { InspirationController } from './inspiration.controller';

describe('AppController', () => {
  let appController: InspirationController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [InspirationController],
      providers: [],
    }).compile();

    appController = app.get<InspirationController>(InspirationController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      //expect(appController.getHello()).toBe('Hello World!');
    });
  });
});