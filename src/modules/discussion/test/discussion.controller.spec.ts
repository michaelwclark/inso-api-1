import { HttpException, HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance, Type } from 'class-transformer';
import { validate } from 'class-validator';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model, Types } from 'mongoose';
import { DiscussionCreateDTO } from 'src/entities/discussion/create-discussion';
import { Discussion, DiscussionSchema } from 'src/entities/discussion/discussion';
import { Inspiration, InspirationSchema } from 'src/entities/inspiration/inspiration';
import { Score, ScoreSchema } from 'src/entities/score/score';
import { SettingsCreateDTO } from 'src/entities/setting/create-setting';
import { Setting, SettingSchema } from 'src/entities/setting/setting';
import { User, UserSchema } from 'src/entities/user/user';
import { DiscussionController } from '../discussion.controller';

describe('AppController', () => {
  let appController: DiscussionController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let discussionModel: Model<any>;
  let userModel: Model<any>;
  let settingModel: Model<any>;
  let scoreModel: Model<any>;
  let inspirationModel: Model<any>;
  let calendarModel: Model<any>;
  
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    discussionModel = mongoConnection.model(Discussion.name, DiscussionSchema);
    userModel = mongoConnection.model(User.name, UserSchema);
    settingModel = mongoConnection.model(Setting.name, SettingSchema);
    scoreModel = mongoConnection.model(Score.name, ScoreSchema);
    inspirationModel = mongoConnection.model(Inspiration.name, InspirationSchema);

    await userModel.insertMany([
      {
        "_id": new Types.ObjectId('62b276fda78b2a00063b1de0'),
        "f_name": "Paige",
        "l_name": "Zaleppa"
      }
    ])

    await settingModel.insertMany([
      {
        "id": new Types.ObjectId('62b276fda78b2a00063b1de0'),
        "prompt": "This is a prompt",
        'post_inspiration': ["62b276fda78b2a00063b1de0"],
        "score": "5",
        "calendar": "",
        "userId": '62b276fda78b2a00063b1de0'
      }
    ])
  });

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DiscussionController],
      providers: [{provide: getModelToken(Discussion.name), useValue: discussionModel},
        {provide: getModelToken(User.name), useValue: userModel},
        {provide: getModelToken(Setting.name), useValue: settingModel},
        {provide: getModelToken(Score.name), useValue: scoreModel},
        {provide: getModelToken(Inspiration.name), useValue: inspirationModel}
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
  //200 status valid for setting here 
  describe('PATCH /discussion/:discussionId/settings 200 Status' , () => {
    it('Should return valid Discussion Id', () => {

      const validDiscussionId = {
        "id": new Types.ObjectId ('62b276fda78b2a00063b1de0'),
        "prompt": ("This is a prompt"),
        "post_inspiration": new Types.ObjectId ['62b276fda78b2a00063b1de0'],
        "score": new Types.ObjectId ('62b276fda78b2a00063b1de0'),
        "calendar": new Types.ObjectId (),
        "userId": new Types.ObjectId ('62b276fda78b2a00063b1de0')
        }; 
        
        return expect(appController.updateDiscussionSettings(validDiscussionId, '62b276fda78b2a00063b1de0' )).resolves.toMatchObject(validDiscussionId);
      
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

  // add 400 status error settings here checks against SettingsDTO
  

  //400 ERROR STATUS
  //invalid discussion id
   describe('PATCH discussion/:discussionId/settings 400 Status',  () => {
    it('Should return 400 for invalid Discussion Id in setting', async () => {

      const invalidDiscussionId = {
        "id": new Types.ObjectId ('62b276fda78b2a00063b1de0'),
        "prompt": "This is a prompt",
        'post_inspiration': new Types.ObjectId [('62b276fda78b2a00063b1de0')],
        "score": "5",
        "calendar": "",
        "userId": new Types.ObjectId('62b276fda78b2a00063b1de0')
        };

        const invalid = plainToInstance(SettingsCreateDTO, invalidDiscussionId);
        const errors = await validate(invalid);
        expect(JSON.stringify(errors)).toContain('Discussion Id not valid Id for setting'); 
      });
    

    //no disccussion id
    it('Should return 400 for no Discussiod Id in setting', async () => {

      const noDiscussionId = {
        'id': "No ID"
      };

      const invalid = plainToInstance(SettingsCreateDTO, noDiscussionId);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(' No Discussion Id for setting');
    
    });

    //valid discussion id, starter prompt not less than 2
    it('should return a 400 for prompt is less than 2 characters', async () => {
      const validDiscussionId = {
        "name": "Valid Name",
        "prompt": "s"
       };

      const invalid = plainToInstance(SettingsCreateDTO, validDiscussionId);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(2);
      expect(JSON.stringify(errors)).toContain('Prompt should not be less than 2 characters');
    });
    
    //valid discussion id, post inspiration id not valid
    it('should throw a 400 for missing name', async () => {
      const validDiscussionId = { 
        "poster": null,
      };

      const invalid = plainToInstance(SettingsCreateDTO, validDiscussionId);
      const errors = await validate(invalid);
      
      expect(JSON.stringify(errors)).toContain('Post Inspiration Id is not valid Id for setting');
    });

    //valid discussion id, score id is not valid
    it('should throw a 400 for non Valid Score Id', async () => {
      const validDiscussionId = { 
        "score": null,
      };

      const invalid = plainToInstance(SettingsCreateDTO, validDiscussionId);
      const errors = await validate(invalid);
      expect(JSON.stringify(errors)).toContain('Score Id is not valid Id for setting');
    });
    
    //valid discussion id, calendar id is not valid
    it('should throw a 400 for an undefined calendar', async () => {
      const validDiscussionId = { 
        "calendar": null,
      };

      const invalid = plainToInstance(SettingsCreateDTO, validDiscussionId);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('Calendar Id is not valid Id for setting');
    });
    
    //valid discussion id, empty object
    it('should throw a 400 for an empty object', async () => {
      const invalidDiscussion = {};

      const invalid = plainToInstance(SettingsCreateDTO, invalidDiscussion);
      const errors = await validate(invalid);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain('id should not be empty');
      expect(JSON.stringify(errors)).toContain('prompt should not be empty');
      expect(JSON.stringify(errors)).toContain('post_inspiration should not be empty');
      expect(JSON.stringify(errors)).toContain('score should not be empty');
      expect(JSON.stringify(errors)).toContain('calendar should not be empty');
      expect(JSON.stringify(errors)).toContain('userId should not be empty');
    });
  });
  
  // add 404 status aerrors for settings checks agains mongoo db

  //404 error status
  describe('PATCH /discussion/:discussionId/setting 404 status', () => {
    it('should throw a 404 for non-existent Discussion Id not found for Setting', () => {
      const non_existentDiscussionId = {
      "id": new Types.ObjectId('62b276fda78b2a00063b1de0'),
      "prompt": "This is a prompt",
      "post_inspiration": [new Types.ObjectId('62b276fda78b2a00063b1de0')],
      "score": new Types.ObjectId(),
      "calendar": new Types.ObjectId(),
      "userId": new Types.ObjectId('62b276fda78b2a00063b1de0')
      };
      const error = new HttpException('Discussion Id does not exist', HttpStatus.NOT_FOUND);
      return expect(appController.updateDiscussionSettings(non_existentDiscussionId, '62b276fda78b2a00063b1de0')).rejects.toThrow(error);
    });

    it('should throw a 404 error for a post inspiration not found', () => {
      const validDiscussion = {
      "id": new Types.ObjectId('62b276fda78b2a00063b1de0'),
      "prompt": "This is a prompt",
      "post_inspiration": [new Types.ObjectId('62b276fda78b2a00063b1de0')],
      "score": new Types.ObjectId(),
      "calendar": new Types.ObjectId(),
      "userId": new Types.ObjectId('62b276fda78b2a00063b1de0')
        };
      const error = new HttpException("Post inspiration Id does not exist", HttpStatus.NOT_FOUND);
      return expect(appController.updateDiscussionSettings(validDiscussion,'62b276fda78b2a00063b1de0' )).rejects.toThrow(error);
    });

    it('should throw a 404 error for a score id not found for setting', () => {
      const validDiscussion = {
        "id": new Types.ObjectId('62b276fda78b2a00063b1de0'),
        "prompt": "This is a prompt",
        "post_inspiration": [new Types.ObjectId('62b276fda78b2a00063b1de0')],
        "score": null,
        "calendar": new Types.ObjectId(),
        "userId": new Types.ObjectId('62b276fda78b2a00063b1de0'),
      };
      const error = new HttpException("Score Id does not exist", HttpStatus.NOT_FOUND);
      return expect(appController.updateDiscussionSettings(validDiscussion, '62b276fda78b2a00063b1de0')).rejects.toThrow(error);
    });

    it('should throw a 404 error for a calendar id not found for setting', () => {
      const validDiscussion = {
        "id": new Types.ObjectId('62b276fda78b2a00063b1de0'),
        "prompt": "This is a prompt",
        "post_inspiration": [new Types.ObjectId('62b276fda78b2a00063b1de0')],
        "score": new Types.ObjectId(),
        "calendar": null,
        "userId": new Types.ObjectId('62b276fda78b2a00063b1de0'),
      }
      const error = new HttpException("Calendar Id does not exist", HttpStatus.NOT_FOUND);
      return expect(appController.updateDiscussionSettings(validDiscussion, '62b276fda78b2a00063b1de0')).rejects.toThrow(error);
    });
  });

  afterAll(done => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoConnection.close();
    done()
  });

});

