// import { getModelToken } from '@nestjs/mongoose';
// import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model, Types } from 'mongoose';
import { InspirationCreateDTO } from 'src/entities/inspiration/create-inspiration';
import { InspirationEditDTO } from 'src/entities/inspiration/edit-inspiration';
import {
  Inspiration,
  InspirationSchema,
} from 'src/entities/inspiration/inspiration';
// import { InspirationController } from './inspiration.controller';

describe('InspirationController', () => {
  // let appController: InspirationController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let inspirationModel: Model<any>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    inspirationModel = mongoConnection.model(
      Inspiration.name,
      InspirationSchema,
    );

    await inspirationModel.insertMany([
      {
        _id: new Types.ObjectId('62b5f60a215d620007224dec'),
        name: 'test inspo',
        type: 'responding',
        instructions: 'Please create a poll for the people you care about',
        outline: [
          {
            header: 'Instructions',
            prompt: 'prompt',
          },
        ],
      },
    ]);
  });

  beforeEach(async () => {
    // const app: TestingModule = await Test.createTestingModule({
    //   controllers: [InspirationController],
    //   providers: [
    //     {
    //       provide: getModelToken(Inspiration.name),
    //       useValue: inspirationModel,
    //     },
    //   ],
    // }).compile();
    // appController = app.get<InspirationController>(InspirationController);
  });

  describe('POST /inspiration', () => {
    it('should return a 400 for a number as the name', async () => {
      const testInspo = {
        name: 1200,
        type: 'responding',
        instructions: 'Please create a poll for the people you care about',
        outline: [
          {
            header: 'Instructions',
            prompt: 'prompt',
          },
        ],
      };
      const invalid = plainToInstance(InspirationCreateDTO, testInspo);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('name must be a string');
    });

    it('should return a 400 for an undefined name', async () => {
      const testInspo = {
        name: undefined,
        type: 'responding',
        instructions: 'Please create a poll for the people you care about',
        outline: [
          {
            header: 'Instructions',
            prompt: 'prompt',
          },
        ],
      };
      const invalid = plainToInstance(InspirationCreateDTO, testInspo);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('name must be a string');
    });

    it('should return a 400 for a number as the type', async () => {
      const testInspo = {
        name: 'testing',
        type: 1200,
        instructions: 'Please create a poll for the people you care about',
        outline: [
          {
            header: 'Instructions',
            prompt: 'prompt',
          },
        ],
      };
      const invalid = plainToInstance(InspirationCreateDTO, testInspo);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('type must be a string');
    });

    it('should return a 400 for an invalid type for the inspiration', async () => {
      const testInspo = {
        name: 'testing',
        type: 'reposting',
        instructions: 'Please create a poll for the people you care about',
        outline: [
          {
            header: 'Instructions',
            prompt: 'prompt',
          },
        ],
      };
      const invalid = plainToInstance(InspirationCreateDTO, testInspo);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(
        'type must be one of the following values: responding, posting, synthesizing',
      );
    });

    it('should return a 400 for a number as instructions', async () => {
      const testInspo = {
        name: 'testing',
        type: 'responding',
        instructions: 1200,
        outline: [
          {
            header: 'Instructions',
            prompt: 'prompt',
          },
        ],
      };
      const invalid = plainToInstance(InspirationCreateDTO, testInspo);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('instructions must be a string');
    });

    it('should return a 400 for undefined instructions', async () => {
      const testInspo = {
        name: 'testing',
        type: 'responding',
        instructions: undefined,
        outline: [
          {
            header: 'Instructions',
            prompt: 'prompt',
          },
        ],
      };
      const invalid = plainToInstance(InspirationCreateDTO, testInspo);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('instructions must be a string');
    });

    it('should return a 400 for a number for outline.header', async () => {
      const testInspo = {
        name: 'testing',
        type: 'responding',
        instructions: 'instructions are good',
        outline: [
          {
            header: 100,
            prompt: 'prompt',
          },
        ],
      };
      const invalid = plainToInstance(InspirationCreateDTO, testInspo);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('header must be a string');
    });

    it('should return a 400 for a number for outline.prompt', async () => {
      const testInspo = {
        name: 'testing',
        type: 'responding',
        instructions: 'instructions are good',
        outline: [
          {
            header: 'header',
            prompt: 100,
          },
        ],
      };
      const invalid = plainToInstance(InspirationCreateDTO, testInspo);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('prompt must be a string');
    });

    it('should return a 400 for an undefined outline.header', async () => {
      const testInspo = {
        name: 'testing',
        type: 'responding',
        instructions: 'instructions are good',
        outline: [
          {
            header: undefined,
            prompt: 'prompt',
          },
        ],
      };
      const invalid = plainToInstance(InspirationCreateDTO, testInspo);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('header should not be empty');
    });

    it('should return a 400 for an undefined outline.prompt', async () => {
      const testInspo = {
        name: 'testing',
        type: 'responding',
        instructions: 'instructions are good',
        outline: [
          {
            header: 'header',
            prompt: undefined,
          },
        ],
      };
      const invalid = plainToInstance(InspirationCreateDTO, testInspo);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('prompt must be a string');
    });

    it('should return a 400 for an undefined outline.prompt', async () => {
      const testInspo = {
        name: 'testing',
        type: 'responding',
        instructions: 'instructions are good',
        outline: [
          {
            header: 'header',
            prompt: undefined,
          },
        ],
      };
      const invalid = plainToInstance(InspirationCreateDTO, testInspo);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('prompt should not be empty');
    });

    it('should return a 400 for an object as outline', async () => {
      const testInspo = {
        name: 'testing',
        type: 'responding',
        instructions: 'instructions are good',
        outline: {},
      };
      const invalid = plainToInstance(InspirationCreateDTO, testInspo);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('header should not be empty');
    });

    it('should return a 400 for a missing header in one of the elements of the outline array', async () => {
      const testInspo = {
        name: 'testing',
        type: 'responding',
        instructions: 'instructions are good',
        outline: [
          {
            header: 'header',
            prompt: 'prompt',
          },
          {
            prompt: 'prompty',
          },
        ],
      };
      const invalid = plainToInstance(InspirationCreateDTO, testInspo);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('header should not be empty');
    });
  });

  describe('PATCH /inspiration', () => {
    // it('should return a 200 for a correctly updated inspiration', () => {
    //   const testInspo = {
    //     id: new Types.ObjectId('62b5f60a215d620007224dec'),
    //     name: 'test inspo',
    //     type: 'responding',
    //     instructions: 'Please create a poll for the people you care about',
    //     outline: [
    //       {
    //         header: 'Instructions',
    //         prompt: 'prompt',
    //       },
    //     ],
    //   };
    //   expect(
    //     appController.updateInspiration('62b5f60a215d620007224dec', testInspo),
    //   ).resolves.toHaveProperty('_id');
    // });

    it('should return a 400 for a number as the name', async () => {
      const testInspo = {
        name: 1200,
        type: 'responding',
        instructions: 'Please create a poll for the people you care about',
        outline: [
          {
            header: 'Instructions',
            prompt: 'prompt',
          },
        ],
      };
      const invalid = plainToInstance(InspirationEditDTO, testInspo);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('name must be a string');
    });

    it('should return a 400 for a number as instructions', async () => {
      const testInspo = {
        name: 'testing',
        type: 'responding',
        instructions: 1200,
        outline: [
          {
            header: 'Instructions',
            prompt: 'prompt',
          },
        ],
      };
      const invalid = plainToInstance(InspirationEditDTO, testInspo);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('instructions must be a string');
    });

    it('should return a 400 for a number for outline.header', async () => {
      const testInspo = {
        name: 'testing',
        type: 'responding',
        instructions: 'instructions are good',
        outline: [
          {
            header: 100,
            prompt: 'prompt',
          },
        ],
      };
      const invalid = plainToInstance(InspirationEditDTO, testInspo);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('header must be a string');
    });

    it('should return a 400 for a number for outline.prompt', async () => {
      const testInspo = {
        name: 'testing',
        type: 'responding',
        instructions: 'instructions are good',
        outline: [
          {
            header: 'header',
            prompt: 100,
          },
        ],
      };
      const invalid = plainToInstance(InspirationEditDTO, testInspo);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('prompt must be a string');
    });

    it('should return a 400 for an undefined outline.header', async () => {
      const testInspo = {
        name: 'testing',
        type: 'responding',
        instructions: 'instructions are good',
        outline: [
          {
            header: undefined,
            prompt: 'prompt',
          },
        ],
      };
      const invalid = plainToInstance(InspirationEditDTO, testInspo);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('header should not be empty');
    });

    it('should return a 400 for an undefined outline.prompt', async () => {
      const testInspo = {
        name: 'testing',
        type: 'responding',
        instructions: 'instructions are good',
        outline: [
          {
            header: 'header',
            prompt: undefined,
          },
        ],
      };
      const invalid = plainToInstance(InspirationEditDTO, testInspo);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('prompt must be a string');
    });

    it('should return a 400 for an undefined outline.prompt', async () => {
      const testInspo = {
        name: 'testing',
        type: 'responding',
        instructions: 'instructions are good',
        outline: [
          {
            header: 'header',
            prompt: undefined,
          },
        ],
      };
      const invalid = plainToInstance(InspirationEditDTO, testInspo);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('prompt should not be empty');
    });

    it('should return a 400 for an object as outline', async () => {
      const testInspo = {
        name: 'testing',
        type: 'responding',
        instructions: 'instructions are good',
        outline: {},
      };
      const invalid = plainToInstance(InspirationEditDTO, testInspo);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('header should not be empty');
    });

    it('should return a 400 for a missing header in one of the elements of the outline array', async () => {
      const testInspo = {
        name: 'testing',
        type: 'responding',
        instructions: 'instructions are good',
        outline: [
          {
            header: 'header',
            prompt: 'prompt',
          },
          {
            prompt: 'prompty',
          },
        ],
      };
      const invalid = plainToInstance(InspirationEditDTO, testInspo);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('header should not be empty');
    });
  });
});
