import {
  CreateAutoRequirements,
  CreateGradingCriteria,
  CreatePostInspirationOptions,
  ScoreCreateDTO,
} from './create-score';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  makeFakeCreateAutoRequirements,
  makeFakeCreateGradingCriteria,
  makeFakeCreatePostInspirationOptions,
  makeFakeScoreCreateDTO,
} from './score-fakes';

describe('CreateAutoRequirements', () => {
  it('should be defined', () => {
    expect(CreateAutoRequirements).toBeDefined();
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(new CreateAutoRequirements({})).toBeDefined();
    });

    it('should partial', () => {
      const partial = makeFakeCreateAutoRequirements();
      const sut = new CreateAutoRequirements(partial);
      expect(sut).toBeDefined();
    });
  });

  describe('max_points', () => {
    it('should not be empty', async () => {
      const createAutoRequirements = makeFakeCreateAutoRequirements({
        max_points: undefined,
      });
      const invalid = plainToInstance(
        CreateAutoRequirements,
        createAutoRequirements,
      );
      const errors = await validate(invalid);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });
  });

  describe('required', () => {
    it('should not be empty', async () => {
      const createAutoRequirements = makeFakeCreateAutoRequirements({
        required: undefined,
      });
      const invalid = plainToInstance(
        CreateAutoRequirements,
        createAutoRequirements,
      );
      const errors = await validate(invalid);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });
  });
});

describe('CreatePostInspirationOptions', () => {
  it('should be defined', () => {
    expect(CreatePostInspirationOptions).toBeDefined();
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(new CreatePostInspirationOptions({})).toBeDefined();
    });

    it('should partial', () => {
      const partial = makeFakeCreatePostInspirationOptions();
      const sut = new CreatePostInspirationOptions(partial);
      expect(sut).toBeDefined();
    });
  });

  describe('selected', () => {
    it('should not be empty', async () => {
      const createPostInspirationOptions = makeFakeCreatePostInspirationOptions(
        {
          selected: undefined,
        },
      );
      const invalid = plainToInstance(
        CreatePostInspirationOptions,
        createPostInspirationOptions,
      );
      const errors = await validate(invalid);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });
  });

  describe('max_points', () => {
    it('should not be empty', async () => {
      const createPostInspirationOptions = makeFakeCreatePostInspirationOptions(
        {
          max_points: undefined,
        },
      );
      const invalid = plainToInstance(
        CreatePostInspirationOptions,
        createPostInspirationOptions,
      );
      const errors = await validate(invalid);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });
  });
});

describe('CreateGradingCriteria', () => {
  it('should be defined', () => {
    expect(CreateGradingCriteria).toBeDefined();
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(new CreateGradingCriteria({})).toBeDefined();
    });

    it('should partial', () => {
      const partial = makeFakeCreateGradingCriteria();
      const sut = new CreateGradingCriteria(partial);
      expect(sut).toBeDefined();
    });
  });

  describe('criteria', () => {
    it('should not be empty', async () => {
      const createGradingCriteria = makeFakeCreateGradingCriteria({
        criteria: undefined,
      });
      const invalid = plainToInstance(
        CreateGradingCriteria,
        createGradingCriteria,
      );
      const errors = await validate(invalid);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should be between 2 and 100', async () => {
      const createGradingCriteria = makeFakeCreateGradingCriteria({
        criteria: 'a',
      });
      const invalid = plainToInstance(
        CreateGradingCriteria,
        createGradingCriteria,
      );
      const errors = await validate(invalid);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('isLength');

      const createGradingCriteria2 = makeFakeCreateGradingCriteria({
        criteria: 'a'.repeat(101),
      });
      const invalid2 = plainToInstance(
        CreateGradingCriteria,
        createGradingCriteria2,
      );
      const errors2 = await validate(invalid2);
      expect(errors2.length).toBe(1);
      expect(errors2[0].constraints).toHaveProperty('isLength');
    });
  });

  describe('max_points', () => {
    it('should not be empty', async () => {
      const createGradingCriteria = makeFakeCreateGradingCriteria({
        max_points: undefined,
      });
      const invalid = plainToInstance(
        CreateGradingCriteria,
        createGradingCriteria,
      );
      const errors = await validate(invalid);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });
  });
});

describe('ScoreCreateDTO', () => {
  it('should be defined', () => {
    expect(ScoreCreateDTO).toBeDefined();
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(new ScoreCreateDTO({})).toBeDefined();
    });

    it('should partial auto', () => {
      const partial = makeFakeScoreCreateDTO({ type: 'auto' });
      const sut = new ScoreCreateDTO(partial);
      expect(sut).toBeDefined();
    });

    it('should partial rubric', () => {
      const partial = makeFakeScoreCreateDTO({ type: 'rubric' });
      const sut = new ScoreCreateDTO(partial);
      expect(sut).toBeDefined();
    });
  });

  describe('type', () => {
    it('should not be empty', async () => {
      const scoreCreateDTO = makeFakeScoreCreateDTO({
        type: undefined,
      });
      const invalid = plainToInstance(ScoreCreateDTO, scoreCreateDTO);
      const errors = await validate(invalid);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should be a valid type', async () => {
      const scoreCreateDTO = makeFakeScoreCreateDTO({
        type: 'invalid',
      });
      const invalid = plainToInstance(ScoreCreateDTO, scoreCreateDTO);
      const errors = await validate(invalid);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('isIn');
    });
  });

  describe('total', () => {
    it('should not be empty', async () => {
      const scoreCreateDTO = makeFakeScoreCreateDTO({
        total: undefined,
      });
      const invalid = plainToInstance(ScoreCreateDTO, scoreCreateDTO);
      const errors = await validate(invalid);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('isNumber');
      expect(errors[0].constraints).toHaveProperty('isDefined');
    });
  });

  describe('posts_made', () => {
    it('should validated child', async () => {
      const scoreCreateDTO = makeFakeScoreCreateDTO({
        type: 'auto',
        posts_made: {
          required: undefined,
          max_points: undefined,
        },
      });
      const invalid = plainToInstance(ScoreCreateDTO, scoreCreateDTO);
      const errors = await validate(invalid);
      expect(errors[0].children.length).toBe(2);
    });
  });

  describe('active_days', () => {
    it('should validated child', async () => {
      const scoreCreateDTO = makeFakeScoreCreateDTO({
        type: 'auto',
        active_days: {
          required: undefined,
          max_points: undefined,
        },
      });
      const invalid = plainToInstance(ScoreCreateDTO, scoreCreateDTO);
      const errors = await validate(invalid);
      expect(errors[0].children.length).toBe(2);
    });
  });

  describe('posts_comments_receivedmade', () => {
    it('should validated child', async () => {
      const scoreCreateDTO = makeFakeScoreCreateDTO({
        type: 'auto',
        comments_received: {
          required: undefined,
          max_points: undefined,
        },
      });
      const invalid = plainToInstance(ScoreCreateDTO, scoreCreateDTO);
      const errors = await validate(invalid);
      expect(errors[0].children.length).toBe(2);
    });
  });

  describe('post_inspirations', () => {
    it('should validated child', async () => {
      const scoreCreateDTO = makeFakeScoreCreateDTO({
        type: 'auto',
        post_inspirations: {
          selected: undefined,
          max_points: undefined,
        },
      });
      const invalid = plainToInstance(ScoreCreateDTO, scoreCreateDTO);
      const errors = await validate(invalid);
      expect(errors[0].children.length).toBe(2);
    });
  });

  describe('criteria', () => {
    it('should validated child', async () => {
      const scoreCreateDTO = makeFakeScoreCreateDTO({
        type: 'rubric',
        criteria: [
          {
            max_points: undefined,
            criteria: undefined,
          },
        ],
      });
      const invalid = plainToInstance(ScoreCreateDTO, scoreCreateDTO);
      const errors = await validate(invalid);
      expect(errors[0].children.length).toBe(1);
    });
  });
});
