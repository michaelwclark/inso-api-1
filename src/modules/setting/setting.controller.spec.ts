import { Test, TestingModule } from '@nestjs/testing';
import { SettingController } from './setting.controller';

describe('AppController', () => {
  let appController: SettingController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SettingController],
      providers: [],
    }).compile();

    appController = app.get<SettingController>(SettingController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // expect(appController.getHello()).toBe('Hello World!');
    });
  });
});