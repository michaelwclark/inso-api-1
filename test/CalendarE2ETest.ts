import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { CalendarController } from 'src/modules/calendar/calendar.controller';
import { CalendarModule } from 'src/modules/calendar/calendar.module'

describe('CalendarController', () => {

    let app: INestApplication;
    let CalendarController: CalendarController;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [CalendarModule]
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


    afterAll(async () => {
        await app.close();
    });

})