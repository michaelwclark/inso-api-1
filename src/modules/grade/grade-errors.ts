import { HttpException, HttpStatus } from '@nestjs/common';

export default {
  DISCUSSION_NOT_FOUND: new HttpException(
    'Discussion does not exist',
    HttpStatus.NOT_FOUND,
  ),
  PARTICIPANT_NOT_FOUND: new HttpException(
    "Participant is not a part of this discussion and can't receive a grade",
    HttpStatus.BAD_REQUEST,
  ),
  CRITERIAN_NOT_INCLUDED: new HttpException(
    'Criteria for score not all included',
    HttpStatus.BAD_REQUEST,
  ),
  DISCUSSION_ID_INVALID: new HttpException(
    'Discussion Id is not valid',
    HttpStatus.BAD_REQUEST,
  ),
};
