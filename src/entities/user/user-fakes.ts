import faker from 'test/faker';
import { User } from './user';

export function makeFakeUserPayload(user: Partial<User> = {}): User {
  return {
    id: faker.database.mongoObjectId(),
    username: faker.internet.userName(),
    f_name: faker.name.firstName(),
    l_name: faker.name.lastName(),
    dateJoined: faker.date.past(),
    contact: [
      {
        email: faker.internet.email(),
        verified: faker.datatype.boolean(),
        primary: faker.datatype.boolean(),
        delete: faker.datatype.boolean(),
      },
    ],
    password: faker.internet.password(),
    profilePicture: faker.image.imageUrl(),
    level: faker.random.word(),
    role: faker.random.word(),
    mutedDiscussions: [faker.database.mongoObjectId()],

    ...user,
  };
}
