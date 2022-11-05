import faker from 'test/faker';
import { Discussion } from './discussion';
import { DiscussionCreateDTO } from './create-discussion';
import { DiscussionEditDTO } from './edit-discussion';

export function makeFakeDiscussionCreateDTO(
  discussion: Partial<DiscussionCreateDTO> = {},
): DiscussionCreateDTO {
  return {
    name: faker.lorem.words(3),
    poster: faker.database.fakeMongoId(),
    facilitators: [faker.database.fakeMongoId()],
    ...discussion,
  } as DiscussionCreateDTO;
}

export function makeFakeDiscussionCreateDTOPlain(discussion: any = {}) {
  return {
    name: faker.lorem.words(3),
    poster: faker.database.mongodbObjectId(),
    facilitators: [faker.database.mongodbObjectId()],
    ...discussion,
  };
}

export function makeFakeDiscussionPayload(
  discussion: Partial<Discussion> = {},
): Discussion {
  return {
    insoCode: faker.datatype.string(5),
    name: faker.random.word(),
    created: faker.date.past(),
    archived: faker.date.past(),
    settings: faker.database.fakeMongoId(),
    facilitators: [faker.database.fakeMongoId()],
    poster: faker.database.fakeMongoId(),
    tags: [faker.random.word()],
    keywords: [faker.random.word()],
    participants: [
      {
        user: faker.database.fakeMongoId(),
        joined: faker.date.past(),
        muted: faker.datatype.boolean(),
        grade: faker.database.fakeMongoId(),
      },
    ],
    set: [faker.database.fakeMongoId()],
    ...discussion,
  } as Discussion;
}

export function makeFakeDiscussionEditDTO(
  discussion: Partial<DiscussionEditDTO> = {},
): DiscussionEditDTO {
  return {
    name: faker.lorem.words(3),
    archived: faker.date.past(),
    settings: faker.database.fakeMongoId(),
    facilitators: [faker.database.fakeMongoId()],
    keywords: [faker.random.word()],
    participants: [faker.database.fakeMongoId()],
    ...discussion,
  } as DiscussionEditDTO;
}
