import faker from 'test/faker';
import { Calendar } from './calendar';

export function makeFakeCalendarPayload(
  calendar: Partial<Calendar> = {},
): Calendar {
  return {
    id: faker.database.mongoObjectId(),
    open: faker.date.past(),
    close: faker.date.future(),
    posting: {
      open: faker.date.past(),
      close: faker.date.future(),
    },
    responding: {
      open: faker.date.past(),
      close: faker.date.future(),
    },
    synthesizing: {
      open: faker.date.past(),
      close: faker.date.future(),
    },
    creator: faker.database.mongoObjectId(),
    ...calendar,
  };
}
