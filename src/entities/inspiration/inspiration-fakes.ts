import faker from 'test/faker';
import { Inspiration } from './inspiration';

export function makeFakeInspirationPayload(
  inspiration: Partial<Inspiration> = {},
): Inspiration {
  return {
    type: faker.random.word(),
    subCat: faker.random.word(),
    icon: faker.random.word(),
    name: faker.random.word(),
    instructions: faker.random.word(),
    outline: [
      {
        header: faker.random.word(),
        prompt: faker.random.word(),
      },
    ],
    ...inspiration,
  };
}
