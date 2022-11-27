import { HttpException, HttpStatus } from '@nestjs/common';

export default {
  BAD_DISCUSSION_QUERY: new HttpException(
    'Query parameters are not valid for discussions',
    HttpStatus.BAD_REQUEST
  ),
  USER_NOT_FOUND: new HttpException(
    'User trying to create discussion does not exist',
    HttpStatus.NOT_FOUND,
  ),
  DISCUSSION_NOT_FOUND: new HttpException(
    'Discussion not found',
    HttpStatus.NOT_FOUND,
  ),

  POST_INSPIRATION_NOT_FOUND: new HttpException(
    'Post inspiration not found',
    HttpStatus.NOT_FOUND,
  ),

  CALENDAR_NOT_FOUND: new HttpException(
    'Calendar not found',
    HttpStatus.NOT_FOUND,
  ),

  SCORE_NOT_FOUND: new HttpException('Score not found', HttpStatus.NOT_FOUND),

  DISCUSSION_POSTER_MISMATCH: new HttpException(
    'Discussion poster does not match authentication token user',
    HttpStatus.BAD_REQUEST,
  ),

  FACILITATOR_NOT_FOUND: new HttpException(
    'A user does not exist in the facilitators array',
    HttpStatus.NOT_FOUND,
  ),

  CAN_NOT_EDIT_PARTICIPANTS: new HttpException(
    'Cannot edit discussion participants using this route',
    HttpStatus.BAD_REQUEST,
  ),

  DISCUSSION_ID_INVALID: new HttpException(
    'Discussion Id is not valid',
    HttpStatus.BAD_REQUEST,
  ),

  USER_ID_INVALID: new HttpException(
    'User Id is not valid',
    HttpStatus.BAD_REQUEST,
  ),

  USER_ID_AUTHENTICATION_MISMATCH: new HttpException(
    'User Id does not match authentication token user',
    HttpStatus.BAD_REQUEST,
  ),

  INSO_CODE_INVALID: new HttpException(
    'Inso code is not valid',
    HttpStatus.BAD_REQUEST,
  ),

  DISCUSSION_HAS_POSTS: new HttpException(
    'Discussion has posts and cannot be deleted',
    HttpStatus.CONFLICT,
  ),

  USER_ALREADY_IN_DISCUSSION: new HttpException(
    'User is already in discussion',
    HttpStatus.CONFLICT,
  ),

  PARTICIPANT_NOT_IN_DISUCSSION: new HttpException(
    'Participant not in discussion',
    HttpStatus.BAD_REQUEST,
  ),

  DUPLICATE_TAG: new HttpException(
    'Duplicate tag in discussion',
    HttpStatus.CONFLICT,
  ),
};
