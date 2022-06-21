import { HttpException, HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model, Types } from 'mongoose';
import { ObjectUnsubscribedError } from 'rxjs';
import { Discussion, DiscussionSchema } from 'src/entities/discussion/discussion';
import { User, UserSchema } from 'src/entities/user/user';
import { DiscussionController } from '../discussion.controller';

describe('AppController', () => {
  let appController: DiscussionController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let discussionModel: Model<any>;
  let userModel: Model<any>;
  
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    discussionModel = mongoConnection.model(Discussion.name, DiscussionSchema);
    userModel = mongoConnection.model(User.name, UserSchema);
    
  });

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DiscussionController],
      providers: [{provide: getModelToken(Discussion.name), useValue: discussionModel},
        {provide: getModelToken(User.name), useValue: userModel}],
    }).compile();

    appController = app.get<DiscussionController>(DiscussionController);
  });

  describe('POST /discussion 200 Response', () => {
    const validDiscussion = {
      "name": "Power",
      "poster": new Types.ObjectId(),
      "facilitators": []
    }
    it('should return a valid calendar', () => {
      const error = new HttpException('User trying to create discussion does not exist', HttpStatus.BAD_REQUEST);
      return expect(appController.createDiscussion(validDiscussion)).rejects.toEqual(error);
    });
  });

  describe('POST /discussion 400 Response', () => {
    // it('should throw a 400 for invalid discussion', () => {
    //   expect(async () => { await appController.createDiscussion()}).toBe('Hello World!');
    // });

    // it('should throw a 400 for invalid userId', () => {
    //   expect(async() => { await appController.createDiscussion()}).toBe('Hello World!');
    // });
  });

  afterAll(done => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoConnection.close();
    done()
  });
});