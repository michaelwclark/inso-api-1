import { DiscussionCreateDTO } from './create-discussion';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import faker from 'test/faker';
import { makeFakeDiscussionCreateDTOPlain } from './discussion-fakes';

describe('DiscussionCreateDTO', () => {
  it('should be defined', () => {
    expect(new DiscussionCreateDTO({})).toBeDefined();
  });

  describe('name', () => {
    it('is required and a string', async () => {
      const dto = makeFakeDiscussionCreateDTOPlain({
        name: undefined,
      });
      const invalid = plainToInstance(DiscussionCreateDTO, dto);
      const errors = await validate(invalid);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      expect(errors[0].constraints).toHaveProperty('isString');
    });
  });

  describe('poster', () => {
    it('is required and a string', async () => {
      const dto = makeFakeDiscussionCreateDTOPlain({
        poster: undefined,
      });
      const invalid = plainToInstance(DiscussionCreateDTO, dto);
      const errors = await validate(invalid);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      expect(errors[0].constraints).toHaveProperty('isMongoId');
    });
  });

  describe('facilitators', () => {
    it('is optional and an array of strings', async () => {
      const dto = makeFakeDiscussionCreateDTOPlain({
        facilitators: undefined,
      });
      const invalid = plainToInstance(DiscussionCreateDTO, dto);
      const errors = await validate(invalid);
      expect(errors.length).toBe(0);
    });

    it('when provided should validate isMongoId', async () => {
      const dto = makeFakeDiscussionCreateDTOPlain({
        facilitators: [faker.datatype.string()], // invalid
      });
      const invalid = plainToInstance(DiscussionCreateDTO, dto);
      const errors = await validate(invalid);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('isMongoId');
    });
  });
});
