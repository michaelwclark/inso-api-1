import faker from 'test/faker';
import { UserCreateDTO } from './create-user';
import { UserEditDTO } from './edit-user';
import { User } from './user';

export function makeFakeUserPayload(user: Partial<User> = {}): User {
  const f_name = user.f_name || faker.name.firstName();
  const l_name = user.l_name || faker.name.lastName();
  const username = user.username || `${f_name}${l_name}`;
  return {
    id: faker.database.mongoObjectId(),
    username,
    f_name,
    l_name,
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

export const makeFakeUserCreateDTO = (
  user: Partial<UserCreateDTO> = {},
): UserCreateDTO => ({
  f_name: faker.name.firstName(),
  l_name: faker.name.lastName(),
  contact: [
    {
      email: faker.internet.email(),
      verified: faker.datatype.boolean(),
      primary: faker.datatype.boolean(),
    },
  ],
  password: faker.internet.password(),
  ...user,
});

export const makeFakeUserEditDTO = (
  user: Partial<UserEditDTO> = {},
): UserEditDTO => ({
  username: faker.internet.userName(),
  f_name: faker.name.firstName(),
  l_name: faker.name.lastName(),
  contact: [
    {
      email: faker.internet.email(),
      verified: faker.datatype.boolean(),
      primary: faker.datatype.boolean(),
      delete: faker.datatype.boolean(),
    },
  ],
  level: faker.random.word(),
  role: faker.random.word(),
  profilePicture: faker.image.imageUrl(),
  ...user,
});
