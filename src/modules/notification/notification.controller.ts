import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Model, Types } from 'mongoose';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RequesterIsUserGuard } from '../../auth/guards/userGuards/requesterIsUser.guard';
import { NotificationReadDTO } from '../../entities/notification/read-notification';
import { User, UserDocument } from '../../entities/user/user';
import { NotificationService } from './notification.service';
import NOTIFICATION_ERRORS from './notification-errors';

@Controller()
export class NotificationController {
  constructor(
    private notificationService: NotificationService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  @Get('users/:userId/notifications')
  @ApiOperation({ description: 'Get all notifications for a user' })
  @ApiOkResponse({
    description: 'Array of notifications',
    type: [NotificationReadDTO],
  })
  @ApiNotFoundResponse({ description: 'User was not found' })
  @ApiForbiddenResponse({
    description: 'User is not permitted to see notifications for this user',
  })
  @ApiUnauthorizedResponse({ description: 'The user is not authenticated' })
  @ApiTags('Notifications')
  @UseGuards(JwtAuthGuard, RequesterIsUserGuard)
  async getNotifications(@Param('userId') userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw NOTIFICATION_ERRORS.USER_ID_INVALID;
    }
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw NOTIFICATION_ERRORS.USER_NOT_FOUND;
    }
    return await this.notificationService.getNotifications(
      new Types.ObjectId(userId),
    );
  }

  @Patch('users/:userId/notifications/:notificationId/read')
  @ApiOperation({ description: 'Get all notifications for a user' })
  @ApiOkResponse({
    description: 'Array of notifications',
    type: [NotificationReadDTO],
  })
  @ApiNotFoundResponse({ description: 'User was not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({
    description: 'User is not permitted to see notifications for this user',
  })
  @ApiTags('Notifications')
  @UseGuards(JwtAuthGuard, RequesterIsUserGuard)
  async markNotificationAsRead(
    @Param('userId') userId: string,
    @Param('notificationId') notificationId: string,
  ) {
    if (!Types.ObjectId.isValid(userId)) {
      throw NOTIFICATION_ERRORS.USER_ID_INVALID;
    }
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw NOTIFICATION_ERRORS.USER_NOT_FOUND;
    }
    if (!Types.ObjectId.isValid(notificationId)) {
      throw NOTIFICATION_ERRORS.NOTIFICATION_ID_INVALID;
    }
    return this.notificationService.markNotificationAsRead(
      new Types.ObjectId(notificationId),
    );
  }

  @Patch('users/:userId/notifications/readall')
  @ApiOperation({ description: 'Mark all notifications as read for a user' })
  @ApiOkResponse({
    description: 'Array of notifications',
    type: [NotificationReadDTO],
  })
  @ApiNotFoundResponse({ description: 'User was not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({
    description: 'User is not permitted to see notifications for this user',
  })
  @ApiTags('Notifications')
  @UseGuards(JwtAuthGuard, RequesterIsUserGuard)
  async markAllNotificationAsRead(@Param('userId') userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw NOTIFICATION_ERRORS.USER_ID_INVALID;
    }
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw NOTIFICATION_ERRORS.USER_NOT_FOUND;
    }
    this.notificationService.markAllNotificationsAsRead(
      new Types.ObjectId(userId),
    );

    return 'All notifications marked as read';
  }

  @Delete('users/:userId/notifications/:notificationId')
  @ApiOperation({ description: 'Delete a notification' })
  @ApiOkResponse({ description: 'Notification deleted' })
  @ApiNotFoundResponse({ description: 'User or notification was not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({
    description: 'User is not permitted to delete this notification',
  })
  @UseGuards(JwtAuthGuard, RequesterIsUserGuard)
  async deleteNotification(
    @Param('userId') userId: string,
    @Param('notificationId') notificationId: string,
  ) {
    if (!Types.ObjectId.isValid(userId)) {
      throw NOTIFICATION_ERRORS.USER_ID_INVALID;
    }
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw NOTIFICATION_ERRORS.USER_NOT_FOUND;
    }
    if (!Types.ObjectId.isValid(notificationId)) {
      throw NOTIFICATION_ERRORS.NOTIFICATION_ID_INVALID;
    }
    return this.notificationService.deleteNotification(
      new Types.ObjectId(notificationId),
    );
  }
}
