import { HttpException, HttpStatus } from '@nestjs/common';

export default {
  USER_ID_INVALID: new HttpException(
    'User Id is not valid',
    HttpStatus.BAD_REQUEST,
  ),
  USER_NOT_FOUND: new HttpException('User not found', HttpStatus.NOT_FOUND),
  SCORE_ID_INVALID: new HttpException(
    'Score Id is not valid',
    HttpStatus.BAD_REQUEST,
  ),
  SCORE_EMPTY: new HttpException('Score is empty', HttpStatus.BAD_REQUEST),
  SCORE_NOT_FOUND: new HttpException('Score not found', HttpStatus.NOT_FOUND),
  SCORE_TOTAL_INVALID: new HttpException(
    'Score total does not add up',
    HttpStatus.BAD_REQUEST,
  ),
};
