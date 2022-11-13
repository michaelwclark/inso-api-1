import { HttpException, HttpStatus } from '@nestjs/common';
export default {
  POST_ID_INVALID: new HttpException(
    'Post ID is invalid',
    HttpStatus.BAD_REQUEST,
  ),
  POST_NOT_FOUND: new HttpException(
    'Post does not exist',
    HttpStatus.NOT_FOUND,
  ),
  USER_NOT_FOUND: new HttpException(
    'User does not exist',
    HttpStatus.NOT_FOUND,
  ),
  USER_MISMATCH: new HttpException(
    'User cannot delete a reaction for another user',
    HttpStatus.FORBIDDEN,
  ),
  REACTION_NOT_FOUND: new HttpException(
    'Reaction does not exist',
    HttpStatus.NOT_FOUND,
  ),
};
