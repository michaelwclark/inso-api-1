import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, Module } from '@nestjs/common';
import { CalendarController } from '../src/modules/calendar/calendar.controller';
import { CalendarModule } from '../src/modules/calendar/calendar.module';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { factory } from 'fakingoose';
import { Calendar, CalendarDocument, CalendarSchema } from '../src/entities/calendar/calendar';
import { connect, Connection, Model } from 'mongoose';
 
describe('CalendarController', () => {

    let app: INestApplication;
    let calendarController: any;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let calendarModel: Model<any>;
   
   // const CalendarFactory = factory<CalendarDocument>(CalendarDocument, {}).setGlobalObjectIdOptions({ tostring: false})

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
    
        //calendarModel = mongoConnection.model(Calendar.name, CalendarSchema);

        const moduleFixture: TestingModule = await Test.createTestingModule
        ({
           controllers: [calendarController],
            //providers: [{provide: getModelToken(Calendar.name), useValue: calendarModel}]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    })

    it('Testing /POST', async () => {
        //return request(app.getHttpServer())
        //.post('/users/:userId/calendar/:calendarId')
        //.expect(200)

        const postCalendarReq = {
            "open": "Fri Jun 17 2022 13:01:58 GMT-0400 (Eastern Daylight Time)",
            "close": "Fri Jun 25 2022 13:01:58 GMT-0400 (Eastern Daylight Time)"
        }

        const response =  await request(app.getHttpServer)
        .post('/users/629a3aaa17d028a1f19f0e5c/calendar/629a69deaa8494f552c89cd9')
        //route with a valid user id and calendar id
        .send(postCalendarReq)

        expect(response.status).toBe(200);

        
    });


    //afterAll(async () => {
    //    await app.close();
    //});

})