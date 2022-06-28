import { Test, TestingModule } from '@nestjs/testing';
import { connect, Connection, Model, Types } from 'mongoose';
import { SettingController } from './setting.controller';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Inspiration, InspirationSchema } from 'src/entities/inspiration/inspiration';
import { Discussion, DiscussionSchema } from 'src/entities/discussion/discussion';
import { Setting, SettingSchema } from 'src/entities/setting/setting';
import { Score, ScoreSchema } from 'src/entities/score/score';
import { User } from 'src/entities/user/user';
import { getModelToken } from '@nestjs/mongoose';
import { Calendar } from 'src/entities/calendar/calendar';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SettingsCreateDTO } from 'src/entities/setting/create-setting';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SettingsEditDTO } from 'src/entities/setting/edit-setting';

describe('AppController', () => {
    let appController: SettingController, Sett;
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
      userModel = mongoConnection.model(User.name) //, UserSchema);
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

    });

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
          controllers: [SettingController],
          providers: [{provide: getModelToken(Setting.name), useValue: settingModel},
          {provide: getModelToken(Discussion.name), useValue: discussionModel},
          {provide: getModelToken(User.name), useValue: userModel},
          {provide: getModelToken(Score.name), useValue: scoreModel},
          {provide: getModelToken(Inspiration.name), useValue: inspirationModel},
          {provide: getModelToken(Calendar.name), useValue: calendarModel}],
        }).compile();

        appController = app.get<SettingController>(SettingController);
      });
    
    describe('root', () => {
      it('should return "Hello World!"', () => {
        expect(appController.getHello()).toBe('Hello World!');
      });
    });

    //Valid Discussion ID. Valid discussion settings write DTO. Return 200 status
    describe('PATCH /discussion/:discussionId/settings 200 Status' , () => {
      it('Should return valid Discussion Id', () => {

        const validDiscussionId = {
          "id": "62b276fda78b2a00063b1de0",
          "prompt": "This is a prompt",
          'post_inspiration': [" "],
          "Score": "5",
          "Calendar": "",
          "userId": new Types.ObjectId('62b276fda78b2a00063b1de0')
          }; 
          
          return expect(appController.createSetting(validDiscussionId)).resolves.toMatchObject(validDiscussionId);
        
      }); 
    }); 

    //400 ERROR STATUS
    //invalid discussion id
     describe('PATCH discussion/:discussionId/settings 400 Status',  () => {
      it('Should return 400 for invalid Discussion Id in setting', async () => {

        const invalidDiscussionId = {
          "id": "62b276fda78b2a00063b1de0",
          "prompt": "This is a prompt",
          'post_inspiration': [" "],
          "Score": "5",
          "Calendar": "",
          "userId": new Types.ObjectId('62b276fda78b2a00063b1de0')
          };

          const invalid = plainToInstance(SettingsCreateDTO, invalidDiscussionId);
          const errors = await validate(invalid);
          expect(JSON.stringify(errors)).toContain('Discussion Id not valid Id for setting'); 
        });

      //no disccussion id
      it('Should return 400 for no Discussiod Id in setting', async () => {

        const noDiscussionId = {
          'name': "No ID"
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
          "Score": null,
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
        expect(JSON.stringify(errors)).toContain('name should not be empty');
        expect(JSON.stringify(errors)).toContain('poster should not be empty');
      });
  
      //404 error status
      describe('PATCH /discussion/:discussionId/setting 404 status', () => {
        it('should throw a 404 for non-existent Discussion Id not found for Setting', () => {
          const non_existentDiscussionId = {
            "id": null,
          "prompt": "This is a prompt",
          'post_inspiration': [" "],
          "Score": "5",
          "Calendar": "",
          "userId": new Types.ObjectId('62b276fda78b2a00063b1de0')
          };
          const error = new HttpException("Discussion Id does not exist", HttpStatus.NOT_FOUND);
          return expect(appController.createSetting(non_existentDiscussionId)).rejects.toThrow(error);
        });
    
        it('should throw a 404 error for a post inspiration not found', () => {
          const validDiscussion = {
            "id": "62b276fda78b2a00063b1de0",
            "prompt": "This is a prompt",
            'post_inspiration': [null],
            "Score": "5",
            "Calendar": "",
            "userId": new Types.ObjectId('62b276fda78b2a00063b1de0')
            };
          const error = new HttpException("Post inspiration Id does not exist", HttpStatus.NOT_FOUND);
          return expect(appController.createSetting(validDiscussion)).rejects.toThrow(error);
        });

        it('should throw a 404 error for a score id not found for setting', () => {
          const validDiscussion = {
            "id": "62b276fda78b2a00063b1de0",
          "prompt": "This is a prompt",
          'post_inspiration': [" "],
          "Score": null,
          "Calendar": "",
          "userId": new Types.ObjectId('62b276fda78b2a00063b1de0')
          };
          const error = new HttpException("Score Id does not exist", HttpStatus.NOT_FOUND);
          return expect(appController.createSetting(validDiscussion)).rejects.toThrow(error);
        });

        it('should throw a 404 error for a calendar id not found for setting', () => {
          const validDiscussion = {
            "id": "62b276fda78b2a00063b1de0",
          "prompt": "This is a prompt",
          'post_inspiration': [" "],
          "Score": "5",
          "Calendar": null,
          "userId": new Types.ObjectId('62b276fda78b2a00063b1de0')
          };
          const error = new HttpException("Calendar Id does not exist", HttpStatus.NOT_FOUND);
          return expect(appController.createSetting(validDiscussion)).rejects.toThrow(error);
        });

      

       //non existent discussion id 404
        it('should throw a 404 for non-existent Discussion Id for Setting', async () => {
          const non_existentDiscussionId = {
            "id": "62b276fda78b2a00063b1de0",
            "prompt": "This is a prompt",
            'post_inspiration': [" "],
            "Score": "5",
            "Calendar": "",
            "userId": new Types.ObjectId()
            };
          const invalid = plainToInstance(SettingsCreateDTO, non_existentDiscussionId);
          const errors = await validate(invalid);
          expect(errors.length).not.toBe(0);
          expect(JSON.stringify(errors)).toContain('poster must be a mongodb id');
        
        });  
    });


    afterAll(done => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoConnection.close();
    done()

    // function UserSchema(name: any, UserSchema: any): Model<any, {}, {}, {}> {
    //   throw new Error('Function not implemented.');
    //   }
    // function validSetting(arg0: string, validSetting: any) {
    //   throw new Error('Function not implemented.');
    //   }
  
  });
  
});
