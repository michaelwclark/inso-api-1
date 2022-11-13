import { HttpException, HttpStatus } from '@nestjs/common';

export default {
  EMAIL_IN_USE: new HttpException(
    'Email is already in use',
    HttpStatus.BAD_REQUEST,
  ),
  INVALID_EMAIL: new HttpException(
    'Invalid email address',
    HttpStatus.BAD_REQUEST,
  ),
  USER_NOT_FOUND: new HttpException('User not found', HttpStatus.NOT_FOUND),
  USERNAME_IN_USE: new HttpException(
    'Username already exists, please choose another',
    HttpStatus.BAD_REQUEST,
  ),
  INVALID_USER_ID: new HttpException(
    'User ID is invalid',
    HttpStatus.BAD_REQUEST,
  ),
  MISSING_EMAIL: new HttpException(
    'At least one Email is required',
    HttpStatus.BAD_REQUEST,
  ),
  ONLY_ONE_PRIMARY_EMAIL: new HttpException(
    'Only one email can be primary',
    HttpStatus.BAD_REQUEST,
  ),
  PASSWORDS_DO_NOT_MATCH: new HttpException(
    'Passwords do not match',
    HttpStatus.BAD_REQUEST,
  ),
  USER_EMAIL_ALREADY_VERIFIED: new HttpException(
    'Email has already been verified',
    HttpStatus.CONFLICT,
  ),
};
