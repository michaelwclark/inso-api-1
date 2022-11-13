import { HttpException, HttpStatus } from '@nestjs/common';
export default {
  USER_ID_INVALID: new HttpException(
    'User Id is not valid',
    HttpStatus.BAD_REQUEST,
  ),
  NOTIFICATION_ID_INVALID: new HttpException(
    'Notification Id is not valid',
    HttpStatus.BAD_REQUEST,
  ),
  USER_NOT_FOUND: new HttpException('User not found', HttpStatus.NOT_FOUND), // 404
};
