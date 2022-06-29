import { HttpException, HttpStatus, Post } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model, Types } from 'mongoose';
import { DiscussionCreateDTO } from 'src/entities/discussion/create-discussion';
import { Discussion, DiscussionSchema } from 'src/entities/discussion/discussion';
import { DiscussionPost, DiscussionPostSchema } from 'src/entities/post/post';
import { User, UserSchema } from 'src/entities/user/user';
import { DiscussionController } from '../discussion.controller';

describe('AppController', () => {
  let appController: DiscussionController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let discussionModel: Model<any>;
  let userModel: Model<any>;
  let postModel: Model<any>;
  
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    discussionModel = mongoConnection.model(Discussion.name, DiscussionSchema);
    userModel = mongoConnection.model(User.name, UserSchema);
    postModel = mongoConnection.model(DiscussionPost.name, DiscussionPostSchema)

    await userModel.insertMany([
      {
        "_id": new Types.ObjectId('62b276fda78b2a00063b1de0'),
        "f_name": "Paige",
        "l_name": "Zaleppa"
      }
    ])
    
  });

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DiscussionController],
      providers: [{provide: getModelToken(Discussion.name), useValue: discussionModel},
        {provide: getModelToken(User.name), useValue: userModel},
        {provide: getModelToken(DiscussionPost.name), useValue: postModel},
      ],
    }).compile();

    appController = app.get<DiscussionController>(DiscussionController);
  });

  describe('POST /discussion 200 Response', () => {
    it('should return a valid calendar', () => {
      const validDiscussion = {
        "name": "Power",
        "poster": new Types.ObjectId('62b276fda78b2a00063b1de0'),
        "facilitators": []
      }

      return expect(appController.createDiscussion(validDiscussion)).resolves.toMatchObject(validDiscussion);
    });
  });

  describe('POST /discussion 401 Response', () => {
    // TODO AFTER AUTHENTICATION IS WRITTEN
  });

  describe('POST /discussion 400 Response', () => {
    it('should throw a 400 for invalid discussion name', async () => {
      const invalidDiscussion = {
        "name": 1234,
        "poster": new Types.ObjectId()
      };

      const invalid = plainToInstance(DiscussionCreateDTO, invalidDiscussion);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('name must be a string');
    });

    it('should throw a 400 for invalid userId for poster', async () => {
      const invalidDiscussion = {
        "name": "Invalid testing discussion",
        "poster": "123456"
      };

      const invalid = plainToInstance(DiscussionCreateDTO, invalidDiscussion);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('poster must be a mongodb id');
    });

    it('should throw a 400 for an empty object', async () => {
      const invalidDiscussion = { };

      const invalid = plainToInstance(DiscussionCreateDTO, invalidDiscussion);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('name should not be empty');
      expect(JSON.stringify(errors)).toContain('poster should not be empty');
    });

    it('should throw a 400 for missing name', async () => {
      const invalidDiscussion = { 
        "poster": "62b276fda78b2a00063b1de0"
      };

      const invalid = plainToInstance(DiscussionCreateDTO, invalidDiscussion);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('name should not be empty');
    });

    it('should throw a 400 for missing poster', async () => {
      const invalidDiscussion = { 
        "name": "I don't have a poster"
      };

      const invalid = plainToInstance(DiscussionCreateDTO, invalidDiscussion);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('poster should not be empty');
    });

    it('should throw a 400 for an undefined poster', async () => {
      const invalidDiscussion = { 
        "name": "I don't have a poster",
        "poster": undefined
      };

      const invalid = plainToInstance(DiscussionCreateDTO, invalidDiscussion);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('poster should not be empty');
    });

    it('should throw a 400 for an undefined name', async () => {
      const invalidDiscussion = { 
        "name": undefined,
        "poster": "62b276fda78b2a00063b1de0"
      };

      const invalid = plainToInstance(DiscussionCreateDTO, invalidDiscussion);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('name should not be empty');
    });

    it('should throw a 400 for an null name', async () => {
      const invalidDiscussion = { 
        "name": null,
        "poster": "62b276fda78b2a00063b1de0"
      };

      const invalid = plainToInstance(DiscussionCreateDTO, invalidDiscussion);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('name should not be empty');
    });

    it('should throw a 400 for an null name', async () => {
      const invalidDiscussion = { 
        "name": "I have a null poster bruh",
        "poster": null
      };

      const invalid = plainToInstance(DiscussionCreateDTO, invalidDiscussion);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('poster should not be empty');
    });
  });

  describe('POST /discussion 403 Response', () => {
    // TODO AFTER AUTHORIZATION IS WRITTEN
  });

  describe('POST /discussion 404 Response', () => {
    it('throw a 404 error for poster not found', () => {
      const validDiscussion = {
        "name": "Power",
        "poster": new Types.ObjectId(),
        "facilitators": []
      }
      const error = new HttpException("User trying to create discussion does not exist", HttpStatus.NOT_FOUND);
      return expect(appController.createDiscussion(validDiscussion)).rejects.toThrow(error);
    });

    it('throw a 404 error for a facilitator not found', () => {
      const validDiscussion = {
        "name": "Power",
        "poster": new Types.ObjectId('62b276fda78b2a00063b1de0'),
        "facilitators": [new Types.ObjectId()]
      }
      const error = new HttpException("A user does not exist in the facilitators array", HttpStatus.NOT_FOUND);
      return expect(appController.createDiscussion(validDiscussion)).rejects.toThrow(error);
    });
  });

  afterAll(done => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoConnection.close();
    done()
  });
});