import faker from 'test/faker';
// import { Reaction } from './reaction';
import { CreateReactionDTO } from 'src/entities/reaction/create-reaction';
import { UpdateReactionDTO } from 'src/entities/reaction/edit-reaction';

export const makeFakeCreateReactionDTO = (
  reaction: Partial<CreateReactionDTO> = {},
): CreateReactionDTO => ({
  userId: faker.database.mongoObjectId(),
  reaction: faker.emoji(),
  unified: faker.random.word(),
  ...reaction,
});

export const makeFakeUpdateReactionDTO = (
  reaction: Partial<UpdateReactionDTO> = {},
): UpdateReactionDTO => ({
  reaction: faker.emoji(),
  unified: faker.random.word(),
  ...reaction,
});
