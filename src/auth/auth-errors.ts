import { HttpException, HttpStatus } from '@nestjs/common';

export default {
  EMAIL_NOT_FOUND: new HttpException('Email not found', HttpStatus.NOT_FOUND), // 404
  DISCUSSION_NOT_FOUND: new HttpException(
    'Discussion not found',
    HttpStatus.NOT_FOUND,
  ), // 404
  SSO_CONFIGURED: new HttpException(
    'User has Google SSO configured. Please login through Google',
    HttpStatus.BAD_REQUEST,
  ), // 400
  INVALID_PASSWORD: new HttpException(
    'Invalid password',
    HttpStatus.UNAUTHORIZED,
  ), // 400
  USER_NOT_FOUND: new HttpException('User not found', HttpStatus.NOT_FOUND), // 404
  USER_NOT_FOUND_GOOGLE: new HttpException(
    'User does not exist to Google!',
    HttpStatus.NOT_FOUND,
  ), // 404
  PASSWORD_NOT_MATCH: new HttpException(
    'Invalid credentials, old password is not correct',
    HttpStatus.BAD_REQUEST,
  ), // 400
  FORBIDDEN_FOR_USER: new HttpException(
    'User is not authorized to preform this action.',
    HttpStatus.FORBIDDEN,
  ), // 401
  INVALID_ID: new HttpException(
    'Invalid ID',
    HttpStatus.BAD_REQUEST, // 400
  ), // 400
};
