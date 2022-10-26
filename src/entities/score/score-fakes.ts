import faker from 'test/faker';
import { Score } from './score';

export function makeFakeScorePayload(score: Partial<Score> = {}): Score {
  return {
    type: faker.random.word(),
    total: faker.datatype.number(),
    posts_made: {
      max_points: faker.datatype.number(),
      required: faker.datatype.number(),
    },
    active_days: {
      max_points: faker.datatype.number(),
      required: faker.datatype.number(),
    },
    comments_received: {
      max_points: faker.datatype.number(),
      required: faker.datatype.number(),
    },
    post_inspirations: {
      max_points: faker.datatype.number(),
      selected: faker.datatype.boolean(),
    },
    criteria: [
      {
        criteria: faker.random.word(),
        max_points: faker.datatype.number(),
      },
    ],
    creatorId: faker.database.fakeMongoId(),
    ...score,
  };
}
