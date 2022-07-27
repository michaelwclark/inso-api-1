import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequesterIsUserGuard } from 'src/auth/guards/userGuards/requesterIsUser.guard';
import { NotificationReadDTO } from 'src/entities/notification/read-notification';


@Controller()
export class NotificationController {
  constructor(

  ) {}

    @Get('users/:userId/notifications')
    @ApiOperation({ description: 'Get all notifications for a user'})
    @ApiOkResponse({ description: 'Array of notifications', type: [NotificationReadDTO]})
    @ApiNotFoundResponse({ description: 'User was not found'})
    @ApiForbiddenResponse({ description: 'User is not permitted to see notifications for this user'})
    @ApiUnauthorizedResponse({ description: 'The user is not authenticated'})
    @ApiTags('Notifications')
    @UseGuards(JwtAuthGuard, RequesterIsUserGuard)
    async getNotifications(@Param('userId') userId: string) {

    }

    @Patch('users/:userId/notifications/:notificationId/read')
    @ApiOperation({ description: 'Get all notifications for a user'})
    @ApiOkResponse({ description: 'Array of notifications', type: [NotificationReadDTO]})
    @ApiNotFoundResponse({ description: 'User was not found'})
    @ApiUnauthorizedResponse({ description: 'User is not authenticated'})
    @ApiForbiddenResponse({ description: 'User is not permitted to see notifications for this user'})
    @ApiTags('Notifications')
    @UseGuards(JwtAuthGuard, RequesterIsUserGuard)
    async markNotificationAsRead(@Param('userId') userId: string, @Param('notificationId') notificationId: string) {

    }

}