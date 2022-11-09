import { HttpException, HttpStatus } from '@nestjs/common';
import { isEmail } from './isEmail';

/** validates the username for a new user or when updating a username, the value meets all  required conditions */
export function validateUsername(userName: string) {
  if (userName.length < 5 || userName.length > 32) {
    throw new HttpException(
      'Username length must be at least 5 characters and no more than 32',
      HttpStatus.BAD_REQUEST,
    );
  }

  if (isEmail(userName) == true) {
    throw new HttpException(
      'Username cannot be an email address',
      HttpStatus.BAD_REQUEST,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Filter = require('bad-words'),
    filter = new Filter();
  filter.addWords('shithead', 'fuckingking');
  const badUsernameCheck = filter.clean(userName);
  if (badUsernameCheck.includes('*')) {
    throw new HttpException(
      'Username cannot contain obscene or profain language',
      HttpStatus.BAD_REQUEST,
    );
  }
}
