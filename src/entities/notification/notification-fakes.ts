import faker from 'test/faker';
import { NotificationReadDTO } from './read-notification';

export const makeFakeNotificationReadDTO = (
  notification: Partial<NotificationReadDTO> = {},
): NotificationReadDTO => ({
  _id: faker.database.mongoObjectIdString(),
  user: {
    f_name: faker.name.firstName(),
    l_name: faker.name.lastName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
  },
  date: faker.date.past(),
  notificationHeader: faker.random.word(),
  notificationText: faker.random.word(),
  type: faker.random.word(),
  notificationUser: {
    f_name: faker.name.firstName(),
    l_name: faker.name.lastName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
  },
  ...notification,
});
