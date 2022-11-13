import { NotificationService } from './notification.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { testingDatabase, TestingDatabase, FakeDocuments } from 'test/database';
import { Notification } from 'src/entities/notification/notification';
import faker from 'test/faker';
import { Types } from 'mongoose';

describe('NotificationService', () => {
  let database: TestingDatabase;
  let module: TestingModule;
  let fakeDocuments: FakeDocuments;

  beforeAll(async () => {
    database = await testingDatabase();
  });

  let notificationService: NotificationService;
  beforeEach(async () => {
    fakeDocuments = await database.createFakes();
    module = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: getModelToken(Notification.name),
          useValue: database.notification,
        },
      ],
    }).compile();
    notificationService = module.get<NotificationService>(NotificationService);
  });

  afterEach(async () => {
    await database.clearDatabase();
    jest.clearAllMocks();
  });

  describe('createNotification', () => {
    it('should return new notification', async () => {
      const testHeader = faker.lorem.sentence();
      const testText = faker.lorem.sentence();
      const testType = faker.lorem.word();
      const result = await notificationService.createNotification(
        fakeDocuments.user._id,
        fakeDocuments.user._id,
        {
          header: testHeader,
          type: testType,
          text: testText,
        },
      );

      expect(result).toMatchObject({
        userId: expect.any(Types.ObjectId),
        __v: 0,
        date: expect.any(Date),
        header: testHeader,
        text: testText,
        type: testType,
        read: false,
        notificationUser: expect.any(Types.ObjectId),
      });
    });
  });

  describe('markNotificationAsRead', () => {
    it('should return updated notification', async () => {
      const testHeader = faker.lorem.sentence();
      const testText = faker.lorem.sentence();
      const testType = faker.lorem.word();
      const notification = await notificationService.createNotification(
        fakeDocuments.user._id,
        fakeDocuments.user._id,
        {
          header: testHeader,
          type: testType,
          text: testText,
        },
      );

      const result = await notificationService.markNotificationAsRead(
        notification._id,
      );

      expect(result).toMatchObject({
        userId: expect.any(Types.ObjectId),
        __v: 0,
        date: expect.any(Date),
        header: testHeader,
        text: testText,
        type: testType,
        read: true,
        notificationUser: expect.any(Types.ObjectId),
      });
    });
  });

  describe('markAllNotificationsAsRead', () => {
    it('should return updated notifications', async () => {
      const testHeader = faker.lorem.sentence();
      const testText = faker.lorem.sentence();
      const testType = faker.lorem.word();
      await notificationService.createNotification(
        fakeDocuments.user._id,
        fakeDocuments.user._id,
        {
          header: testHeader,
          type: testType,
          text: testText,
        },
      );
      await notificationService.createNotification(
        fakeDocuments.user._id,
        fakeDocuments.user._id,
        {
          header: testHeader,
          type: testType,
          text: testText,
        },
      );

      const result = await notificationService.markAllNotificationsAsRead(
        fakeDocuments.user._id,
      );

      expect(result).toMatchObject({
        acknowledged: true,
        matchedCount: 2,
        modifiedCount: 2,
        upsertedCount: 0,
        upsertedId: null,
      });
    });
  });

  describe('getNotifications', () => {
    it('should return notifications', async () => {
      const testHeader = faker.lorem.sentence();
      const testText = faker.lorem.sentence();
      const testType = faker.lorem.word();
      await notificationService.createNotification(
        fakeDocuments.user._id,
        fakeDocuments.user._id,
        {
          header: testHeader,
          type: testType,
          text: testText,
        },
      );
      await notificationService.createNotification(
        fakeDocuments.user._id,
        fakeDocuments.user._id,
        {
          header: testHeader,
          type: testType,
          text: testText,
        },
      );

      const result = await notificationService.getNotifications(
        fakeDocuments.user._id,
      );
      expect(result).toMatchObject([
        {
          _id: expect.any(Types.ObjectId),
          user: {
            f_name: expect.any(String),
            l_name: expect.any(String),
            username: expect.any(String),
            email: expect.any(String),
          },
          date: expect.any(Date),
          notificationHeader: testHeader,
          notificationText: testText,
          type: testType,
          notificationUser: {
            f_name: expect.any(String),
            l_name: expect.any(String),
            username: expect.any(String),
            email: expect.any(String),
          },
        },
        {
          _id: expect.any(Types.ObjectId),
          user: {
            f_name: expect.any(String),
            l_name: expect.any(String),
            username: expect.any(String),
            email: expect.any(String),
          },
          date: expect.any(Date),
          notificationHeader: testHeader,
          notificationText: testText,
          type: testType,
          notificationUser: {
            f_name: expect.any(String),
            l_name: expect.any(String),
            username: expect.any(String),
            email: expect.any(String),
          },
        },
      ]);
    });
  });

  describe('deleteNotification', () => {
    it('should return deleted notification', async () => {
      const testHeader = faker.lorem.sentence();
      const testText = faker.lorem.sentence();
      const testType = faker.lorem.word();
      const notification = await notificationService.createNotification(
        fakeDocuments.user._id,
        fakeDocuments.user._id,
        {
          header: testHeader,
          type: testType,
          text: testText,
        },
      );

      const result = await notificationService.deleteNotification(
        notification._id,
      );

      expect(result).toMatchObject({
        userId: expect.any(Types.ObjectId),
        __v: 0,
        date: expect.any(Date),
        header: testHeader,
        text: testText,
        type: testType,
        read: false,
        notificationUser: expect.any(Types.ObjectId),
      });
    });
  });
});
