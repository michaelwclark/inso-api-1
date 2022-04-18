import { Test, TestingModule } from '@nestjs/testing';
import { CalendarController } from './calendar.controller';

describe('AppController', () => {
  let appController: CalendarController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CalendarController],
      providers: [],
    }).compile();

    appController = app.get<CalendarController>(CalendarController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});