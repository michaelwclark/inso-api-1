import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { appendFile } from 'fs';
import * as request from 'supertest';
import { PostController } from '../src/modules/post/post.controller';
import { PostModule } from '../src/modules/post/post.module';

describe('AppController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PostModule]
    })
      .compile();
    
      app = moduleRef.createNestApplication();
      await app.init();
  });

  describe('POST discussion/:discussionId/post', () => {
    it('should return a 200 for a valid post', () => {
      return request(app.getHttpServer())
        .post('/discussion/123/post')
        .expect({
          data: {}
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});