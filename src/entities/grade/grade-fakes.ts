import faker from 'test/faker';
import { Grade } from './grade';
import { GradeDTO, GradeCriteria } from './create-grade';

export function makeFakeGradeCriteria(
  criteria: Partial<GradeCriteria> = {},
): GradeCriteria {
  return {
    criteria: faker.lorem.words(3),
    max_points: faker.datatype.number(),
    earned: faker.datatype.number(),
    ...criteria,
  };
}

export function makeFakeGradeDTO(grade: Partial<GradeDTO> = {}): GradeDTO {
  return {
    total: faker.datatype.number(),
    criteria: [makeFakeGradeCriteria()],
    comments: faker.lorem.words(3),
    ...grade,
  };
}

export function makeFakeGradeCreateDTOPlain(grade: any = {}) {
  return {
    total: faker.datatype.number(),
    criteria: [
      {
        criteria: faker.lorem.words(3),
        max_points: faker.datatype.number(),
        earned: faker.datatype.number(),
      },
    ],
    ...grade,
  };
}

export function makeFakeGradePayload(grade: Partial<Grade> = {}): Grade {
  return {
    discussionId: faker.database.fakeMongoId(),
    userId: faker.database.fakeMongoId(),
    grade: faker.datatype.number(),
    maxScore: faker.datatype.number(),
    comment: faker.lorem.words(3),
    rubric: [
      {
        criteria: faker.lorem.words(3),
        max_points: faker.datatype.number(),
        earned: faker.datatype.number(),
      },
    ],
    facilitator: faker.database.fakeMongoId(),
    ...grade,
  };
}
