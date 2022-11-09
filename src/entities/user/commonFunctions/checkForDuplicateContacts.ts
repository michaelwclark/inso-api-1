import { ContactCreateDTO } from '../create-user';
import { HttpException, HttpStatus } from '@nestjs/common';
/** checks if array of new contacts in User create or edit DTOs, contains duplicate emails */
export function checkForDuplicateContacts(array: ContactCreateDTO[]) {
  const contactsArray = array;
  const unique = contactsArray.filter(
    (c, index, self) => index === self.findIndex((t) => t.email === c.email),
  );

  if (array.length != unique.length) {
    throw new HttpException(
      'Cannot have duplicate emails in array',
      HttpStatus.BAD_REQUEST,
    );
  } else {
    return unique;
  }
}
