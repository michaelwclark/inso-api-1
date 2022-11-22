import { HttpException, HttpStatus } from '@nestjs/common';

export default {
  DISCUSSION_ARCHIVED: new HttpException(
    'Discussion is archived',
    HttpStatus.BAD_REQUEST,
  ), // 400
  USER_MUTED: new HttpException(
    'User is muted in this discussion',
    HttpStatus.BAD_REQUEST,
  ), // 400
  DISCUSSION_CLOSED: new HttpException(
    'Discussion is closed',
    HttpStatus.BAD_REQUEST,
  ), // 400
  POST_NOT_FOUND: new HttpException('Post not found', HttpStatus.NOT_FOUND), // 404
  POST_ID_INVALID: new HttpException(
    'Post ID is invalid',
    HttpStatus.BAD_REQUEST,
  ), // 400
  CAN_NOT_DELETE_POST: new HttpException(
    'Can not delete post with comments',
    HttpStatus.BAD_REQUEST,
  ), // 400
  PARTICIPANT_ID_INVALID: new HttpException(
    'Participant ID is invalid',
    HttpStatus.BAD_REQUEST,
  ), // 400
  DISCUSSION_ID_INVALID: new HttpException(
    'Discussion ID is invalid',
    HttpStatus.BAD_REQUEST,
  ), // 400
  DISCUSSION_NOT_FOUND: new HttpException(
    'Discussion not found',
    HttpStatus.NOT_FOUND,
  ), // 404
  POST_INSPIRATION_NOT_FOUND: new HttpException(
    'Post Inspiration not found',
    HttpStatus.NOT_FOUND,
  ), // 404
  POST_INSPIRATION_ID_INVALID: new HttpException(
    'Post Inspiration ID is invalid',
    HttpStatus.BAD_REQUEST,
  ), // 400
  POST_WITH_BAD_WORDS: new HttpException(
    'Post cannot contain obscene or profane language',
    HttpStatus.BAD_REQUEST,
  ),
};
