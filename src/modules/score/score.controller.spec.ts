import { HttpException, HttpStatus } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance, Type } from 'class-transformer';
import { validate } from 'class-validator';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model, Types } from 'mongoose';
import { ScoreCreateDTO } from 'src/entities/score/create-score';
import { Score, ScoreSchema } from 'src/entities/score/score';
import { User, UserSchema } from 'src/entities/user/user';
import { ScoreController } from './score.controller';
import { instPostingEmpty, instPostingNotNum, instRespondingEmpty, instRespondingNotNum,
         instructionsEmpty, instSynthesizingEmpty, instSynthesizingNotNum, interactionsEmpty, interMaxEmpty, interMaxNotNum, typeNotString, typeNull, validScore } from './scoreMocks';


  const testScore = {
    'type': 'rubric',
    'instructions':  {
      'posting': 10,
      'responding': 10,
      'synthesizing': 10
    },
    'interactions': {
      'max': 10
    },
    'impact': {
      'max': 10
    },
    'rubric': {
      'max': 10,
      'criteria': [ {
          'description': 'This is an example',
          'max': 10
          } ]
       }

  }

  const testScoreUpdate = {
    'id': new Types.ObjectId('629a3aaa17d028a1f19f0888'),
    '_id': new Types.ObjectId('629a3aaa17d028a1f19f0888'),
    'type': 'rubric',
    'instructions':  {
      'posting': 10,
      'responding': 10,
      'synthesizing': 10
    },
    'interactions': {
      'max': 10
    },
    'impact': {
      'max': 10
    },
    'rubric': {
      'max': 10,
      'criteria': [ {
          'description': 'This is an example',
          'max': 10
          } ]
    },
    'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')

  }

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

    const tempUser = new userModel(
      {
        "_id": new Types.ObjectId('629a3aaa17d028a1f19f0e5c'),
         "username" : "mockuser1234"
      });
    await userModel.insertMany([tempUser]);
    await scoreModel.insertMany([testScore, testScoreUpdate]);

    const app: TestingModule = await Test.createTestingModule({
      controllers: [ScoreController],
      providers: [{provide: getModelToken(Score.name), useValue: scoreModel},
        {provide: getModelToken(User.name), useValue: userModel}],
    }).compile();

    appController = app.get<ScoreController>(ScoreController);
  });

  describe('root', () => {
    it('should return "Hello World!', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('POST /users/{userId}/score 200 STATUS', () => {
    it('Test case valid request', async ()=> {
      expect( await appController.createScore('629a3aaa17d028a1f19f0e5c', testScore)).toBe('Score created successfullyyy');
    })
  });

  describe('POST /users/{userId}/score 400 STATUS', () => {
    it('Test case invalid user id', ()=> {
      const error = new HttpException("User id is not valid", HttpStatus.BAD_REQUEST);
      return expect( appController.createScore('User id is not valid', validScore)).rejects.toThrow(error);
    }) // FINISHED

    it('Test case no user id', () => {
      const error = new HttpException("No user id provided", HttpStatus.BAD_REQUEST);
      return expect( appController.createScore(null, validScore)).rejects.toThrow(error);
    }) // FINISHED

    it('Test case non existent user id', () => {
      const error = new HttpException("User does not exist", HttpStatus.BAD_REQUEST);
      return expect( appController.createScore('629a3aaa17d028a1f19f0888', validScore)).rejects.toThrow(error);
    }) // FINISHED

    it('Test case type is not a string', async() => {
      const typeNotStringScore = plainToInstance(ScoreCreateDTO, typeNotString);
      const typeNotStringErrors = await validate(typeNotStringScore);
      expect(typeNotStringErrors.length).not.toBe(0);
      expect(JSON.stringify(typeNotStringErrors)).toContain('type must be a string');
    }) // FINISHED

    it('Test case type is null', async() => {
      const typeUndefinedScore = plainToInstance(ScoreCreateDTO, typeNull);
      const typeNullErrors = await validate(typeUndefinedScore);
      expect(typeNullErrors.length).not.toBe(0);
      expect(JSON.stringify(typeNullErrors)).toContain('type should not be empty');
    }) // FINISHED 

    it('Test case instructions is empty', async() => {
      const instructionsEmptyScore = plainToInstance(ScoreCreateDTO, instructionsEmpty);
      const errors = await validate(instructionsEmptyScore);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('instructions should not be empty');
    }) // FINISHED

    it('Test case instructions posting is not a number', async() => {
      const Score = plainToInstance(ScoreCreateDTO, instPostingNotNum);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message = errors[0].property + ' ' + errors[0].children[0].constraints.isNumber;
      expect(message).toBe('instructions posting must be a number conforming to the specified constraints');
    }) // FINISHED

    it('Test case instructions posting is empty', async() => {
      const Score = plainToInstance(ScoreCreateDTO, instPostingEmpty);
      const errors = await validate(Score);
       expect(errors.length).not.toBe(0);
       const message = errors[0].property + ' ' + errors[0].children[0].constraints.isNotEmpty;
       expect(message).toBe('instructions posting should not be empty');
      
    }) // NOT FINISHED, ISEMPTY DECORATOR DOESN'T FUNCTION WHEN POSTING IS EMPTY STRING

    it('Test case instructions responding is not a number', async() => {
      const Score = plainToInstance(ScoreCreateDTO, instRespondingNotNum);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message = errors[0].property + ' ' + errors[0].children[0].constraints.isNumber;
      expect(message).toBe('instructions responding must be a number conforming to the specified constraints');
    }) // FINISHED

    it('Test case instructions responding is empty', async() => {
      const Score = plainToInstance(ScoreCreateDTO, instRespondingEmpty);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message = errors[0].property + ' ' + errors[0].children[0].constraints.isNotEmpty;
      expect(message).toBe('instructions responding should not be empty');
    }) // FINISHED

    it('Test case instructions synthesizing is not a number', async() => {
      const Score = plainToInstance(ScoreCreateDTO, instSynthesizingNotNum);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message = errors[0].property + ' ' + errors[0].children[0].constraints.isNumber;
      expect(message).toBe('instructions synthesizing must be a number conforming to the specified constraints');
    }) // FINISHED

    it('Test case instructions synthesizing is empty', async() => {
      const Score = plainToInstance(ScoreCreateDTO, instSynthesizingEmpty);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message = errors[0].property + ' ' + errors[0].children[0].constraints.isNotEmpty;
      expect(message).toBe('instructions synthesizing should not be empty');
    }) // FINISHED

    it('Test case interactions is empty', async() => {
      const Score = plainToInstance(ScoreCreateDTO, interactionsEmpty);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('interactions should not be empty');
    }) // FINISHED

    it('Test case interactions max is not a number', async() => {
      const Score = plainToInstance(ScoreCreateDTO, interMaxNotNum);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message = errors[0].property + ' ' + errors[0].children[0].constraints.isNumber;
      expect(message).toBe('interactions max must be a number conforming to the specified constraints');
    }) // FINISHED
    
    it('Test case interactions max is empty', async() => {
      const Score = plainToInstance(ScoreCreateDTO, interMaxEmpty);
      const errors = await validate(Score);
      expect(errors.length).not.toBe(0);
      const message = errors[0].property + ' ' + errors[0].children[0].constraints.isNotEmpty;
      expect(message).toBe('interactions max should not be empty');
    })

  });

  // PATCH TESTS

  describe('PATCH /users/{userId}/score/{scoreId} 200 STATUS', () => {
    it('Patch test', async ()=> {
      expect( await appController.updateScore('629a3aaa17d028a1f19f0e5c', '629a3aaa17d028a1f19f0888', testScoreUpdate)).toBe('Score Updateddd');
    })
  });

  afterAll(async() => {
     await mongoConnection.close();
  });
});