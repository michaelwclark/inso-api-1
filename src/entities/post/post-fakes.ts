import faker from 'test/faker';
import { PostCreateDTO, PostTypeCreateDTO } from './create-post';

export function makeFakePostTypeCreateDTO(
  post: Partial<PostTypeCreateDTO> = {},
): PostTypeCreateDTO {
  return {
    post: faker.lorem.sentence(1),
    outline: {
      fake1: faker.lorem.sentence(1),
      fake2: faker.lorem.sentence(1),
      fake3: faker.lorem.sentence(1),
    },
    ...post,
  };
}
export function makeFakePostCreateDTO(
  post: Partial<PostCreateDTO> = {},
): PostCreateDTO {
  return {
    draft: faker.datatype.boolean(),
    comment_for: faker.database.mongoObjectId(),
    post: makeFakePostTypeCreateDTO(post?.post),
    post_inspiration: faker.database.mongoObjectId(),
    ...post,
  };
}
