import { HttpException, HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model, Types } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { ScoreCreateDTO } from 'src/entities/score/create-score';
import { ScoreEditDTO } from 'src/entities/score/edit-score';
import { Score, ScoreSchema } from 'src/entities/score/score';
import { User, UserSchema } from 'src/entities/user/user';
import { ScoreController } from './score.controller';
import {
  criteriaDescEmpty,
  criteriaDescNotString,
  criteriaMaxEmpty,
  criteriaMaxNotNum,
  impactEmpty,
  impactMaxEmpty,
  impactMaxNotNum,
  instPostingEmpty,
  instPostingNotNum,
  instRespondingEmpty,
  instRespondingNotNum,
  instructionsEmpty,
  instSynthesizingEmpty,
  instSynthesizingNotNum,
  interactionsEmpty,
  interMaxEmpty,
  interMaxNotNum,
  rubricCriteriaArrayWrongType,
  rubricCriteriaEmpty,
  rubricCriteriaEmptyArray,
  rubricEmpty,
  rubricMaxEmpty,
  rubricMaxNotNum,
  typeNotString,
  typeNull,
  validScore,
} from './scoreMocks';
import {
  criteriaDescEmptyUpdate,
  criteriaDescNotStringUpdate,
  criteriaMaxEmptyUpdate,
  criteriaMaxNotNumUpdate,
  impactEmptyUpdate,
  impactMaxEmptyUpdate,
  impactMaxNotNumUpdate,
  instPostingEmptyUpdate,
  instPostingNotNumUpdate,
  instRespondingEmptyUpdate,
  instRespondingNotNumUpdate,
  instructionsEmptyUpdate,
  instSynthesizingEmptyUpdate,
  instSynthesizingNotNumUpdate,
  interactionsEmptyUpdate,
  interMaxEmptyUpdate,
  interMaxNotNumUpdate,
  rubricCriteriaArrayWrongTypeUpdate,
  rubricCriteriaEmptyArrayUpdate,
  rubricCriteriaEmptyUpdate,
  rubricEmptyUpdate,
  rubricMaxEmptyUpdate,
  rubricMaxNotNumUpdate,
  typeNotStringUpdate,
  typeNullUpdate,
} from './scoreMocksPatch';

const testScore = {
  type: 'rubric',
  instructions: {
    posting: 10,
    responding: 10,
    synthesizing: 10,
  },
  interactions: {
    max: 10,
  },
  impact: {
    max: 10,
  },
  rubric: {
    max: 10,
    criteria: [
      {
        description: 'This is an example',
        max: 10,
      },
      {
        description: 'This is another example',
        max: 10,
      },
    ],
  },
};

const testScoreUpdate = {
  id: new Types.ObjectId('629a3aaa17d028a1f19f0888'),
  _id: new Types.ObjectId('629a3aaa17d028a1f19f0888'),
  type: 'rubric',
  instructions: {
    posting: 10,
    responding: 10,
    synthesizing: 10,
  },
  interactions: {
    max: 10,
  },
  impact: {
    max: 10,
  },
  rubric: {
    max: 10,
    criteria: [
      {
        description: 'This is an example',
        max: 10,
      },
    ],
  },
  creatorId: new Types.ObjectId('629a3aaa17d028a1f19f0e5c'),
};

describe('AppController', () => {
  let appController: ScoreController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let scoreModel: Model<any>;
  let userModel: Model<any>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    scoreModel = mongoConnection.model(Score.name, ScoreSchema);
    userModel = mongoConnection.model(User.name, UserSchema);

    const tempUser = new userModel({
      _id: new Types.ObjectId('629a3aaa17d028a1f19f0e5c'),
      username: 'mockuser1234',
    });
    const tempUser2 = new userModel({
      _id: new Types.ObjectId('444a3aaa17d028a1f19f9999'),
      username: 'mockuser5678',
    });
    await userModel.insertMany([tempUser, tempUser2]);
    await scoreModel.insertMany([testScore, testScoreUpdate]);

    const app: TestingModule = await Test.createTestingModule({
      controllers: [ScoreController],
      providers: [
        { provide: AuthService, useValue: {} },
        { provide: getModelToken(Score.name), useValue: scoreModel },
        { provide: getModelToken(User.name), useValue: userModel },
      ],
    }).compile();

    appController = app.get<ScoreController>(ScoreController);
  });

  describe('POST /users/{userId}/score 200 STATUS', () => {
    it('Test case valid request', async () => {
      const result = await appController.createScore(
        '629a3aaa17d028a1f19f0e5c',
        plainToInstance(ScoreCreateDTO, testScore),
      );
      expect(Types.ObjectId.isValid(result)).toBe(true);
    }); // FINISHED
  });

  describe('POST /users/{userId}/score 400 STATUS', () => {
    it('Test case invalid user id', () => {
      const error = new HttpException(
        'User id is not valid',
        HttpStatus.BAD_REQUEST,
      );
      return expect(
        appController.createScore(
          'User id is not valid',
          plainToInstance(ScoreCreateDTO, validScore),
        ),
      ).rejects.toThrow(error);
    }); // FINISHED

    it('Test case no user id', () => {
      const error = new HttpException(
        'No user id provided',
        HttpStatus.BAD_REQUEST,
      );
      return expect(
        appController.createScore(
          null,
          plainToInstance(ScoreCreateDTO, validScore),
        ),
      ).rejects.toThrow(error);
    }); // FINISHED

    it('Test case type is not a string', async () => {
      const typeNotStringScore = plainToInstance(ScoreCreateDTO, typeNotString);
      const typeNotStringErrors = await validate(typeNotStringScore);
      expect(typeNotStringErrors.length).not.toBe(0);
      expect(JSON.stringify(typeNotStringErrors)).toContain(
        'type must be a string',
      );
    }); // FINISHED

    it('Test case type is null', async () => {
      const typeUndefinedScore = plainToInstance(ScoreCreateDTO, typeNull);
      const typeNullErrors = await validate(typeUndefinedScore);
      expect(typeNullErrors.length).not.toBe(0);
      expect(JSON.stringify(typeNullErrors)).toContain(
        'type should not be empty',
      );
    }); // FINISHED

    it('Test case instructions is empty', async () => {
      const instructionsEmptyScore = plainToInstance(
        ScoreCreateDTO,
        instructionsEmpty,
      );
      const errors = await validate(instructionsEmptyScore);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(
        'instructions should not be empty',
      );
    }); // FINISHED

    it('Test case instructions posting is not a number', async () => {
      const Score = plainToInstance(ScoreCreateDTO, instPostingNotNum);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isNumber;
      expect(message).toBe(
        'instructions posting must be a number conforming to the specified constraints',
      );
    }); // FINISHED

    it('Test case instructions posting is empty', async () => {
      const Score = plainToInstance(ScoreCreateDTO, instPostingEmpty);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isNotEmpty;
      expect(message).toBe('instructions posting should not be empty');
    }); // FINISHED

    it('Test case instructions responding is not a number', async () => {
      const Score = plainToInstance(ScoreCreateDTO, instRespondingNotNum);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isNumber;
      expect(message).toBe(
        'instructions responding must be a number conforming to the specified constraints',
      );
    }); // FINISHED

    it('Test case instructions responding is empty', async () => {
      const Score = plainToInstance(ScoreCreateDTO, instRespondingEmpty);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isNotEmpty;
      expect(message).toBe('instructions responding should not be empty');
    }); // FINISHED

    it('Test case instructions synthesizing is not a number', async () => {
      const Score = plainToInstance(ScoreCreateDTO, instSynthesizingNotNum);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isNumber;
      expect(message).toBe(
        'instructions synthesizing must be a number conforming to the specified constraints',
      );
    }); // FINISHED

    it('Test case instructions synthesizing is empty', async () => {
      const Score = plainToInstance(ScoreCreateDTO, instSynthesizingEmpty);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isNotEmpty;
      expect(message).toBe('instructions synthesizing should not be empty');
    }); // FINISHED

    it('Test case interactions is empty', async () => {
      const Score = plainToInstance(ScoreCreateDTO, interactionsEmpty);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(
        'interactions should not be empty',
      );
    }); // FINISHED

    it('Test case interactions max is not a number', async () => {
      const Score = plainToInstance(ScoreCreateDTO, interMaxNotNum);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isNumber;
      expect(message).toBe(
        'interactions max must be a number conforming to the specified constraints',
      );
    }); // FINISHED

    it('Test case interactions max is empty', async () => {
      const Score = plainToInstance(ScoreCreateDTO, interMaxEmpty);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isNotEmpty;
      expect(message).toBe('interactions max should not be empty');
    }); // FINISHED

    it('Test case impact is empty', async () => {
      const Score = plainToInstance(ScoreCreateDTO, impactEmpty);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('impact should not be empty');
    }); // FINISHED

    it('Test case impact max is not a number', async () => {
      const Score = plainToInstance(ScoreCreateDTO, impactMaxNotNum);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isNumber;
      expect(message).toBe(
        'impact max must be a number conforming to the specified constraints',
      );
    }); // FINISHED

    it('Test case impact max is empty', async () => {
      const Score = plainToInstance(ScoreCreateDTO, impactMaxEmpty);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isNotEmpty;
      expect(message).toBe('impact max should not be empty');
    }); // FINISHED

    it('Test case rubric is empty', async () => {
      const Score = plainToInstance(ScoreCreateDTO, rubricEmpty);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('rubric should not be empty');
    }); // FINISHED

    it('Test case rubric max is not a number', async () => {
      const Score = plainToInstance(ScoreCreateDTO, rubricMaxNotNum);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isNumber;
      expect(message).toBe(
        'rubric max must be a number conforming to the specified constraints',
      );
    }); // FINISHED

    it('Test case rubric max is empty', async () => {
      const Score = plainToInstance(ScoreCreateDTO, rubricMaxEmpty);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isNotEmpty;
      expect(message).toBe('rubric max should not be empty');
    }); // FINISHED

    it('Test case rubric criteria is empty', async () => {
      const Score = plainToInstance(ScoreCreateDTO, rubricCriteriaEmpty);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isNotEmpty;
      expect(message).toBe('rubric criteria should not be empty');
    }); // FINISHED

    it('Test case rubric criteria is empty array', () => {
      const error = new HttpException(
        'Array length for criteria cannot be 0',
        HttpStatus.BAD_REQUEST,
      );
      return expect(
        appController.createScore(
          '629a3aaa17d028a1f19f0e5c',
          plainToInstance(ScoreCreateDTO, rubricCriteriaEmptyArray),
        ),
      ).rejects.toThrow(error);
    }); // FINISHED

    it('Test case rubric criteria array is of wrong type', async () => {
      const Score = plainToInstance(
        ScoreCreateDTO,
        rubricCriteriaArrayWrongType,
      );
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(
        'nested property criteria must be either object or array',
      );
    }); // FINISHED

    it('Test case criteria description is not a string', async () => {
      const Score = plainToInstance(ScoreCreateDTO, criteriaDescNotString);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property +
        ' ' +
        errors[0].children[0].property +
        ' ' +
        errors[0].children[0].children[0].children[0].constraints.isString;
      expect(message).toBe('rubric criteria description must be a string');
    }); // FINISHED

    it('Test case criteria description is empty', async () => {
      const Score = plainToInstance(ScoreCreateDTO, criteriaDescEmpty);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property +
        ' ' +
        errors[0].children[0].property +
        ' ' +
        errors[0].children[0].children[0].children[0].constraints.isNotEmpty;
      expect(message).toBe('rubric criteria description should not be empty');
    }); // FINISHED

    it('Test case criteria max is not a number', async () => {
      const Score = plainToInstance(ScoreCreateDTO, criteriaMaxNotNum);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property +
        ' ' +
        errors[0].children[0].property +
        ' ' +
        errors[0].children[0].children[0].children[0].constraints.isNumber;
      expect(message).toBe(
        'rubric criteria max must be a number conforming to the specified constraints',
      );
    }); // FINISHED

    it('Test case criteria max is empty', async () => {
      const Score = plainToInstance(ScoreCreateDTO, criteriaMaxEmpty);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property +
        ' ' +
        errors[0].children[0].property +
        ' ' +
        errors[0].children[0].children[0].children[0].constraints.isNotEmpty;
      expect(message).toBe('rubric criteria max should not be empty');
    }); // FINISHED
  });

  describe('POST /users/{userId}/score 404 STATUS', () => {
    it('Test case non existent user id', () => {
      const error = new HttpException(
        'User does not exist',
        HttpStatus.NOT_FOUND,
      );
      return expect(
        appController.createScore(
          '629a3aaa17d028a1f19f0888',
          plainToInstance(ScoreCreateDTO, validScore),
        ),
      ).rejects.toThrow(error);
    }); // FINISHED
  });

  // PATCH TESTS

  describe('PATCH /users/{userId}/score/{scoreId} 200 STATUS', () => {
    it('Test case valid request', async () => {
      expect(
        await appController.updateScore(
          '629a3aaa17d028a1f19f0e5c',
          '629a3aaa17d028a1f19f0888',
          plainToInstance(ScoreCreateDTO, testScoreUpdate),
        ),
      ).toBe('Score Updated');
    }); // FINISHED
  });

  describe('PATCH /users/{userId}/score/{scoreId} 400 STATUS', () => {
    it('Test case invalid user id', () => {
      const error = new HttpException(
        'User id is not valid',
        HttpStatus.BAD_REQUEST,
      );
      return expect(
        appController.updateScore(
          'User id is not valid',
          '629a3aaa17d028a1f19f0888',
          plainToInstance(ScoreCreateDTO, testScoreUpdate),
        ),
      ).rejects.toThrow(error);
    }); // FINISHED

    it('Test case no user id', () => {
      const error = new HttpException(
        'No user id provided',
        HttpStatus.BAD_REQUEST,
      );
      return expect(
        appController.updateScore(
          null,
          '629a3aaa17d028a1f19f0888',
          plainToInstance(ScoreCreateDTO, testScoreUpdate),
        ),
      ).rejects.toThrow(error);
    }); // FINISHED

    it('Test case invalid score id', () => {
      const error = new HttpException(
        'Score id is not valid',
        HttpStatus.BAD_REQUEST,
      );
      return expect(
        appController.updateScore(
          '629a3aaa17d028a1f19f0e5c',
          'Score id is not valid',
          plainToInstance(ScoreCreateDTO, testScoreUpdate),
        ),
      ).rejects.toThrow(error);
    }); // FINISHED

    it('Test case no score id', () => {
      const error = new HttpException(
        'No score id provided',
        HttpStatus.BAD_REQUEST,
      );
      return expect(
        appController.updateScore(
          '629a3aaa17d028a1f19f0e5c',
          null,
          plainToInstance(ScoreCreateDTO, testScoreUpdate),
        ),
      ).rejects.toThrow(error);
    }); // FINISHED

    it('Test case type is not a string', async () => {
      const score = plainToInstance(ScoreEditDTO, typeNotStringUpdate);
      const errors = await validate(score);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('type must be a string');
    }); // FINISHED

    it('Test case type is null', async () => {
      const score = plainToInstance(ScoreEditDTO, typeNullUpdate);
      const errors = await validate(score);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('type should not be empty');
    }); // FINISHED

    it('Test case instructions is empty', async () => {
      const score = plainToInstance(ScoreEditDTO, instructionsEmptyUpdate);
      const errors = await validate(score);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(
        'instructions should not be empty',
      );
    }); // FINISHED

    it('Test case instructions posting is not a number', async () => {
      const score = plainToInstance(ScoreEditDTO, instPostingNotNumUpdate);
      const errors = await validate(score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isNumber;
      expect(message).toBe(
        'instructions posting must be a number conforming to the specified constraints',
      );
    }); // FINISHED

    it('Test case instructions posting is empty', async () => {
      const Score = plainToInstance(ScoreEditDTO, instPostingEmptyUpdate);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isNotEmpty;
      expect(message).toBe('instructions posting should not be empty');
    }); // FINISHED

    it('Test case instructions responding is not a number', async () => {
      const Score = plainToInstance(ScoreEditDTO, instRespondingNotNumUpdate);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isNumber;
      expect(message).toBe(
        'instructions responding must be a number conforming to the specified constraints',
      );
    }); // FINISHED

    it('Test case instructions responding is empty', async () => {
      const Score = plainToInstance(ScoreEditDTO, instRespondingEmptyUpdate);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isNotEmpty;
      expect(message).toBe('instructions responding should not be empty');
    }); // FINISHED

    it('Test case instructions synthesizing is not a number', async () => {
      const Score = plainToInstance(ScoreEditDTO, instSynthesizingNotNumUpdate);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isNumber;
      expect(message).toBe(
        'instructions synthesizing must be a number conforming to the specified constraints',
      );
    }); // FINISHED

    it('Test case instructions synthesizing is empty', async () => {
      const Score = plainToInstance(ScoreEditDTO, instSynthesizingEmptyUpdate);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isNotEmpty;
      expect(message).toBe('instructions synthesizing should not be empty');
    }); // FINISHED

    it('Test case interactions is empty', async () => {
      const Score = plainToInstance(ScoreEditDTO, interactionsEmptyUpdate);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(
        'interactions should not be empty',
      );
    }); // FINISHED

    it('Test case interactions max is not a number', async () => {
      const Score = plainToInstance(ScoreEditDTO, interMaxNotNumUpdate);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isNumber;
      expect(message).toBe(
        'interactions max must be a number conforming to the specified constraints',
      );
    }); // FINISHED

    it('Test case interactions max is empty', async () => {
      const Score = plainToInstance(ScoreEditDTO, interMaxEmptyUpdate);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isNotEmpty;
      expect(message).toBe('interactions max should not be empty');
    }); // FINISHED

    it('Test case impact is empty', async () => {
      const Score = plainToInstance(ScoreEditDTO, impactEmptyUpdate);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('impact should not be empty');
    }); // FINISHED

    it('Test case impact max is not a number', async () => {
      const Score = plainToInstance(ScoreEditDTO, impactMaxNotNumUpdate);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isNumber;
      expect(message).toBe(
        'impact max must be a number conforming to the specified constraints',
      );
    }); // FINISHED

    it('Test case impact max is empty', async () => {
      const Score = plainToInstance(ScoreEditDTO, impactMaxEmptyUpdate);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isNotEmpty;
      expect(message).toBe('impact max should not be empty');
    }); // FINISHED

    it('Test case rubric is empty', async () => {
      const Score = plainToInstance(ScoreEditDTO, rubricEmptyUpdate);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('rubric should not be empty');
    }); // FINISHED

    it('Test case rubric max is not a number', async () => {
      const Score = plainToInstance(ScoreEditDTO, rubricMaxNotNumUpdate);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isNumber;
      expect(message).toBe(
        'rubric max must be a number conforming to the specified constraints',
      );
    }); // FINISHED

    it('Test case rubric max is empty', async () => {
      const Score = plainToInstance(ScoreEditDTO, rubricMaxEmptyUpdate);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isNotEmpty;
      expect(message).toBe('rubric max should not be empty');
    }); // FINISHED

    it('Test case rubric criteria is empty', async () => {
      const Score = plainToInstance(ScoreEditDTO, rubricCriteriaEmptyUpdate);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property + ' ' + errors[0].children[0].constraints.isNotEmpty;
      expect(message).toBe('rubric criteria should not be empty');
    }); // FINISHED

    it('Test case rubric criteria is empty array', () => {
      const error = new HttpException(
        'Array length for criteria cannot be 0',
        HttpStatus.BAD_REQUEST,
      );
      return expect(
        appController.updateScore(
          '629a3aaa17d028a1f19f0e5c',
          '629a3aaa17d028a1f19f0888',
          plainToInstance(ScoreEditDTO, rubricCriteriaEmptyArrayUpdate),
        ),
      ).rejects.toThrow(error);
    }); // FINISHED

    it('Test case rubric criteria array is of wrong type', async () => {
      const Score = plainToInstance(
        ScoreEditDTO,
        rubricCriteriaArrayWrongTypeUpdate,
      );
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(
        'nested property criteria must be either object or array',
      );
    }); // FINISHED

    it('Test case criteria description is not a string', async () => {
      const Score = plainToInstance(ScoreEditDTO, criteriaDescNotStringUpdate);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property +
        ' ' +
        errors[0].children[0].property +
        ' ' +
        errors[0].children[0].children[0].children[0].constraints.isString;
      expect(message).toBe('rubric criteria description must be a string');
    }); // FINISHED

    it('Test case criteria description is empty', async () => {
      const Score = plainToInstance(ScoreEditDTO, criteriaDescEmptyUpdate);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property +
        ' ' +
        errors[0].children[0].property +
        ' ' +
        errors[0].children[0].children[0].children[0].constraints.isNotEmpty;
      expect(message).toBe('rubric criteria description should not be empty');
    }); // FINISHED

    it('Test case criteria max is not a number', async () => {
      const Score = plainToInstance(ScoreEditDTO, criteriaMaxNotNumUpdate);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property +
        ' ' +
        errors[0].children[0].property +
        ' ' +
        errors[0].children[0].children[0].children[0].constraints.isNumber;
      expect(message).toBe(
        'rubric criteria max must be a number conforming to the specified constraints',
      );
    }); // FINISHED

    it('Test case criteria max is empty', async () => {
      const Score = plainToInstance(ScoreEditDTO, criteriaMaxEmptyUpdate);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message =
        errors[0].property +
        ' ' +
        errors[0].children[0].property +
        ' ' +
        errors[0].children[0].children[0].children[0].constraints.isNotEmpty;
      expect(message).toBe('rubric criteria max should not be empty');
    }); // FINISHED
  });

  describe('PATCH /users/{userId}/score/{scoreId} 403 STATUS', () => {
    it('Test case user id and creator id do not match', () => {
      const error = new HttpException(
        'Total score does not add up',
        HttpStatus.FORBIDDEN,
      );
      return expect(
        appController.updateScore(
          '444a3aaa17d028a1f19f9999',
          '629a3aaa17d028a1f19f0888',
          plainToInstance(ScoreEditDTO, testScoreUpdate),
        ),
      ).rejects.toThrow(error);
    }); // FINISHED
  });

  describe('PATCH /users/{userId}/score/{scoreId} 404 STATUS', () => {
    it('Test case non existent user', () => {
      const error = new HttpException(
        'User does not exist',
        HttpStatus.NOT_FOUND,
      );
      return expect(
        appController.updateScore(
          '629a3aaa17d028a1f19f0888',
          '629a3aaa17d028a1f19f0888',
          plainToInstance(ScoreEditDTO, testScoreUpdate),
        ),
      ).rejects.toThrow(error);
    }); // FINISHED

    it('Test case non existent score', () => {
      const error = new HttpException(
        'Score does not exist',
        HttpStatus.NOT_FOUND,
      );
      return expect(
        appController.updateScore(
          '629a3aaa17d028a1f19f0e5c',
          '629a3aaa17d028a1f19f0e5c',
          plainToInstance(ScoreEditDTO, testScoreUpdate),
        ),
      ).rejects.toThrow(error);
    }); // FINISHED
  });

  afterAll(async () => {
    await mongoConnection.close();
  });
});
