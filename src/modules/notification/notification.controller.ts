import { Controller, Get } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { NotificationReadDTO } from 'src/entities/notification/read-notification';


@Controller()
export class NotificationController {
  constructor(

  ) {}

    @Get('users/:userId/notifications')
    @ApiOperation({ description: 'Get all notifications for a user'})
    @ApiOkResponse({ description: 'Array of notifications', type: [NotificationReadDTO]})
    @ApiNotFoundResponse({ description: 'User was not found'})
    @ApiUnauthorizedResponse({ description: 'User is not permitted to see notifications'})
    @ApiTags('Notifications')
    async getNotifications() {

    }

}