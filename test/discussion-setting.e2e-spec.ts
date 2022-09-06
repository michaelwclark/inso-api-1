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


  describe('PATCH discussion/:discussionId/settings', () => {  
    it('should return a 200 for a valid settings update', () => {
      return request(app.getHttpServer())
        .patch('/discussion/123/settings')
        .expect({
          data: {}
        });
    });
    it('should return a 400 for an invalid discussionId', () => {
      return request(app.getHttpServer())
        .patch('/discussion/123/settings')
        .expect({
          data: {}
        });
    });
    it('should return a 400 for an invalid calendar Id', () => {
      return request(app.getHttpServer())
        .patch('/discussion/123/settings')
        .expect({
          data: {}
        });
    });
    it('should return a 400 for an invalid score Id', () => {
      return request(app.getHttpServer())
        .patch('/discussion/123/settings')
        .expect({
          data: {}
        });
    });
    it('should return a 400 for an invalid post inspiration Id', () => {
      return request(app.getHttpServer())
        .patch('/discussion/123/settings')
        .expect({
          data: {}
        });
    });
    it('should return a 401 for an unauthorized user', () => {
      return request(app.getHttpServer())
        .patch('/discussion/123/settings')
        .expect({
          data: {}
        });
    });
    it('should return a 403 for a user that is not the creator of the discussion', () => {
      return request(app.getHttpServer())
        .patch('/discussion/123/settings')
        .expect({
          data: {}
        });
    });
    it('should return a 404 for a discussion not existing', () => {
      return request(app.getHttpServer())
        .patch('/discussion/123/settings')
        .expect({
          data: {}
        });
    });
    it('should return a 404 for a score that does not exist', () => {
      return request(app.getHttpServer())
        .patch('/discussion/123/settings')
        .expect({
          data: {}
        });
    });
    it('should return a 404 for a calendar that does not exist', () => {
      return request(app.getHttpServer())
        .patch('/discussion/123/settings')
        .expect({
          data: {}
        });
    });
    it('should return a 404 for a post inspiration that does not exist', () => {
      return request(app.getHttpServer())
        .patch('/discussion/123/settings')
        .expect({
          data: {}
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});