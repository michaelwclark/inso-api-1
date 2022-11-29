import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SettingsCreateDTO } from './create-setting';
import { makeFakeSettingsCreateDTOPlain } from './setting-fakes';

describe('SettingsCreateDTO', () => {
  it('should be defined', () => {
    expect(new SettingsCreateDTO({})).toBeDefined();
  });

  describe('starter_prompt', () => {
    it('is optional', async () => {
      const dto = makeFakeSettingsCreateDTOPlain({
        starter_prompt: undefined,
      });
      const invalid = plainToInstance(SettingsCreateDTO, dto);
      const errors = await validate(invalid);
      expect(errors.length).toBe(0);
    });

    it('when provided should validate isString', async () => {
      const dto = makeFakeSettingsCreateDTOPlain({
        starter_prompt: 123, // invalid
      });
      const invalid = plainToInstance(SettingsCreateDTO, dto);
      const errors = await validate(invalid);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('when provided should validate length < 1000', async () => {
      const dto = makeFakeSettingsCreateDTOPlain({
        starter_prompt: 'a'.repeat(3501), // invalid
      });
      const invalid = plainToInstance(SettingsCreateDTO, dto);
      const errors = await validate(invalid);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('isLength');
    });

    it('when provided should validate length > 2', async () => {
      const dto = makeFakeSettingsCreateDTOPlain({
        starter_prompt: 'a',
      });
      const invalid = plainToInstance(SettingsCreateDTO, dto);
      const errors = await validate(invalid);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('isLength');
    });
  });

  describe('post_inspirations', () => {
    it('is optional', async () => {
      const dto = makeFakeSettingsCreateDTOPlain({
        post_inspirations: undefined,
      });
      const invalid = plainToInstance(SettingsCreateDTO, dto);
      const errors = await validate(invalid);
      expect(errors.length).toBe(0);
    });

    it('when provided should validate isMongoId', async () => {
      const dto = makeFakeSettingsCreateDTOPlain({
        post_inspirations: 'invalid', // invalid
      });
      const invalid = plainToInstance(SettingsCreateDTO, dto);
      const errors = await validate(invalid);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('isMongoId');
    });

    it('when provided should validate each as isMongoId', async () => {
      const dto = makeFakeSettingsCreateDTOPlain({
        post_inspirations: ['invalid', 5], // invalid
      });
      const invalid = plainToInstance(SettingsCreateDTO, dto);
      const errors = await validate(invalid);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('isMongoId');
    });
  });

  describe('score', () => {
    it('is optional', async () => {
      const dto = makeFakeSettingsCreateDTOPlain({
        score: undefined,
      });
      const invalid = plainToInstance(SettingsCreateDTO, dto);
      const errors = await validate(invalid);
      expect(errors.length).toBe(0);
    });

    it('when provided should validate isMongoId', async () => {
      const dto = makeFakeSettingsCreateDTOPlain({
        score: '123', // invalid
      });
      const invalid = plainToInstance(SettingsCreateDTO, dto);
      const errors = await validate(invalid);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('isMongoId');
    });
  });

  describe('calendar', () => {
    it('is optional', async () => {
      const dto = makeFakeSettingsCreateDTOPlain({
        calendar: undefined,
      });
      const invalid = plainToInstance(SettingsCreateDTO, dto);
      const errors = await validate(invalid);
      expect(errors.length).toBe(0);
    });

    it('when provided should validate isMongoId', async () => {
      const dto = makeFakeSettingsCreateDTOPlain({
        calendar: '123', // invalid
      });
      const invalid = plainToInstance(SettingsCreateDTO, dto);
      const errors = await validate(invalid);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('isMongoId');
    });
  });
});
