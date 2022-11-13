import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { NotificationController } from './notification.controller';
import { NotificationService } from 'src/modules/notification/notification.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import faker from 'test/faker';
import { TestingDatabase, FakeDocuments, testingDatabase } from 'test/database';
import NOTIFICATION_ERRORS from './notification-errors';
import { User } from 'src/entities/user/user';
import { RequesterIsUserGuard } from 'src/auth/guards/userGuards/requesterIsUser.guard';
import { makeFakeNotificationReadDTO } from 'src/entities/notification/notification-fakes';

describe('NotificationController', () => {
  let database: TestingDatabase;
  let notificationController: NotificationController;
  // let mockRequest: any;
  let fakeDocuments: FakeDocuments;

  const mockNotificationService = {
    createNotification: jest.fn(),
    getNotifications: jest
      .fn()
      .mockResolvedValue([
        makeFakeNotificationReadDTO(),
        makeFakeNotificationReadDTO(),
      ]),
    markNotificationAsRead: jest.fn(),
    markAllNotificationsAsRead: jest.fn(),
    deleteNotification: jest.fn(),
  };

  beforeAll(async () => {
    database = await testingDatabase();
  });

  beforeEach(async () => {
    fakeDocuments = await database.createFakes();
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
        {
          provide: getModelToken(User.name),
          useValue: database.user,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: () => true,
      })
      .overrideGuard(RequesterIsUserGuard)
      .useValue({
        canActivate: () => true,
      })
      .compile();
    notificationController = app.get<NotificationController>(
      NotificationController,
    );
    // mockRequest = {
    //   user: {
    //     userId: fakeDocuments.user._id,
    //     username: fakeDocuments.user.username,
    //   },
    // };
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await database.clearDatabase();
  });

  describe('getNotifications (PATCH /users/:userId/notifications/:notificationId/read)', () => {
    describe('200 OK', () => {
      it('should return notifications', async () => {
        const response = await notificationController.getNotifications(
          fakeDocuments.user._id.toString(),
        );
        expect(mockNotificationService.getNotifications).toHaveBeenCalled();
        expect(response.length).toEqual(2);
      });
    });

    describe('400 BAD REQUEST', () => {
      it('should return 400 if user id is invalid', async () => {
        await expect(
          notificationController.getNotifications('invalid'),
        ).rejects.toThrow(NOTIFICATION_ERRORS.USER_ID_INVALID);
      });
    });

    describe('404 NOT FOUND', () => {
      it('should return 404 if user does not exist', async () => {
        await expect(
          notificationController.getNotifications(
            faker.database.mongoObjectIdString(),
          ),
        ).rejects.toThrow(NOTIFICATION_ERRORS.USER_NOT_FOUND);
      });
    });
  });

  describe('markNotificationAsRead (PATCH users/:userId/notifications/:notificationId/readall)', () => {
    describe('200 OK', () => {
      it('should call notification service', async () => {
        await notificationController.markNotificationAsRead(
          fakeDocuments.user._id.toString(),
          fakeDocuments.notification._id.toString(),
        );

        expect(
          mockNotificationService.markNotificationAsRead,
        ).toHaveBeenCalledWith(fakeDocuments.notification._id);
      });
    });

    describe('400 BAD REQUEST', () => {
      it('should return 400 if user id is invalid', async () => {
        await expect(
          notificationController.markNotificationAsRead('invalid', 'invalid'),
        ).rejects.toThrow(NOTIFICATION_ERRORS.USER_ID_INVALID);
      });

      it('should return 400 if notification id is invalid', async () => {
        await expect(
          notificationController.markNotificationAsRead(
            fakeDocuments.user._id.toString(),
            'invalid',
          ),
        ).rejects.toThrow(NOTIFICATION_ERRORS.NOTIFICATION_ID_INVALID);
      });
    });

    describe('404 NOT FOUND', () => {
      it('should return 404 if user does not exist', async () => {
        await expect(
          notificationController.markNotificationAsRead(
            faker.database.mongoObjectIdString(),
            faker.database.mongoObjectIdString(),
          ),
        ).rejects.toThrow(NOTIFICATION_ERRORS.USER_NOT_FOUND);
      });
    });
  });

  describe('markAllNotificationAsRead (PATCH users/:userId/notifications/readall)', () => {
    describe('200 OK', () => {
      it('should call notification service', async () => {
        await notificationController.markAllNotificationAsRead(
          fakeDocuments.user._id.toString(),
        );

        expect(
          mockNotificationService.markAllNotificationsAsRead,
        ).toHaveBeenCalledWith(fakeDocuments.user._id);
      });
    });

    describe('400 BAD REQUEST', () => {
      it('should return 400 if user id is invalid', async () => {
        await expect(
          notificationController.markAllNotificationAsRead('invalid'),
        ).rejects.toThrow(NOTIFICATION_ERRORS.USER_ID_INVALID);
      });
    });

    describe('404 NOT FOUND', () => {
      it('should return 404 if user does not exist', async () => {
        await expect(
          notificationController.markAllNotificationAsRead(
            faker.database.mongoObjectIdString(),
          ),
        ).rejects.toThrow(NOTIFICATION_ERRORS.USER_NOT_FOUND);
      });
    });
  });

  describe('deleteNotification (DELETE /users/:userId/notifications/:notificationId)', () => {
    describe('200 OK', () => {
      it('should call notification service', async () => {
        await notificationController.deleteNotification(
          fakeDocuments.user._id.toString(),
          fakeDocuments.notification._id.toString(),
        );

        expect(mockNotificationService.deleteNotification).toHaveBeenCalledWith(
          fakeDocuments.notification._id,
        );
      });
    });

    describe('400 BAD REQUEST', () => {
      it('should return 400 if user id is invalid', async () => {
        await expect(
          notificationController.deleteNotification('invalid', 'invalid'),
        ).rejects.toThrow(NOTIFICATION_ERRORS.USER_ID_INVALID);
      });

      it('should return 400 if notification id is invalid', async () => {
        await expect(
          notificationController.deleteNotification(
            fakeDocuments.user._id.toString(),
            'invalid',
          ),
        ).rejects.toThrow(NOTIFICATION_ERRORS.NOTIFICATION_ID_INVALID);
      });
    });

    describe('404 NOT FOUND', () => {
      it('should return 404 if user does not exist', async () => {
        await expect(
          notificationController.deleteNotification(
            faker.database.mongoObjectIdString(),
            faker.database.mongoObjectIdString(),
          ),
        ).rejects.toThrow(NOTIFICATION_ERRORS.USER_NOT_FOUND);
      });
    });
  });
});
