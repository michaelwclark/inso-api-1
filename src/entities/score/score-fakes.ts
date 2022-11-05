import faker from 'test/faker';
import { Score } from './score';
import {
  CreateAutoRequirements,
  CreatePostInspirationOptions,
  CreateGradingCriteria,
  ScoreCreateDTO,
} from './create-score';
import { ScoreEditDTO } from './edit-score';

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

export function makeFakeCreateAutoRequirements(
  CreateAutoRequirements: Partial<CreateAutoRequirements> = {},
): CreateAutoRequirements {
  return {
    max_points: faker.datatype.number(),
    required: faker.datatype.number(),
    ...CreateAutoRequirements,
  };
}
export function makeFakeCreatePostInspirationOptions(
  CreatePostInspirationOptions: Partial<CreatePostInspirationOptions> = {},
): CreatePostInspirationOptions {
  return {
    selected: faker.datatype.boolean(),
    max_points: faker.datatype.number(),
    ...CreatePostInspirationOptions,
  };
}
export function makeFakeCreateGradingCriteria(
  CreateGradingCriteria: Partial<CreateGradingCriteria> = {},
): CreateGradingCriteria {
  return {
    criteria: faker.random.word(),
    max_points: faker.datatype.number(),
    ...CreateGradingCriteria,
  };
}
export function makeFakeScoreCreateDTO(
  ScoreCreateDTO: Partial<ScoreCreateDTO> = {},
): ScoreCreateDTO {
  return {
    type: faker.helpers.arrayElement(['auto', 'rubric']),
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
    ...ScoreCreateDTO,
  };
}

export function makeFakeScoreEditDTO(
  ScoreEditDTO: Partial<ScoreEditDTO> = {},
): ScoreEditDTO {
  return {
    type: faker.helpers.arrayElement(['auto', 'rubric']),
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
    ...ScoreEditDTO,
  };
}
