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


  describe('PATCH users/:userId/discussions/:insoCode/join', () => {  
    it('should return a 200 for user added to a discussion', () => {
      return request(app.getHttpServer())
        .patch('/users/:userId/discussions/:insoCode/join')
        .expect({
          data: {}
        });
    });
    it('should return a 400 for an invalid insoCode', () => {
      return request(app.getHttpServer())
        .patch('/users/:userId/discussions/:insoCode/join')
        .expect({
          data: {}
        });
    });
    it('should return a 400 for an invalid userId', () => {
      return request(app.getHttpServer())
        .patch('/users/:userId/discussions/:insoCode/join')
        .expect({
          data: {}
        });
    });
    it('should return a 401 for an unauthorized user', () => {
      return request(app.getHttpServer())
        .patch('/users/:userId/discussions/:insoCode/join')
        .expect({
          data: {}
        });
    });
    it('should return a 404 the user not found', () => {
      return request(app.getHttpServer())
        .patch('/users/:userId/discussions/:insoCode/join')
        .expect({
          data: {}
        });
    });
    it('should return a 404 the discussion not found', () => {
      return request(app.getHttpServer())
        .patch('/users/:userId/discussions/:insoCode/join')
        .expect({
          data: {}
        });
    });
    it('should return a 409 for a user that is already a participant', () => {
      return request(app.getHttpServer())
        .patch('/users/:userId/discussions/:insoCode/join')
        .expect({
          data: {}
        });
    });
  });


  describe('PATCH users/:userId/discussions/:discussionId/mute', () => { 
    it('should return a 200 for a user successfully muted', () => {
      return request(app.getHttpServer())
        .patch('/users/:userId/discussions/:discussionId/mute')
        .expect({
          data: {}
        });
    });
    it('should return a 400 for an invalid userId', () => {
      return request(app.getHttpServer())
        .patch('/users/:userId/discussions/:discussionId/mute')
        .expect({
          data: {}
        });
    });
    it('should return a 400 for an invalid discussionId', () => {
      return request(app.getHttpServer())
        .patch('/users/:userId/discussions/:discussionId/mute')
        .expect({
          data: {}
        });
    });
    it('should return a 401 for an unauthorized user', () => {
      return request(app.getHttpServer())
        .patch('/users/:userId/discussions/:discussionId/mute')
        .expect({
          data: {}
        });
    });
    it('should return a 403 for a user that is not a facilitator', () => {
      return request(app.getHttpServer())
        .patch('/users/:userId/discussions/:discussionId/mute')
        .expect({
          data: {}
        });
    });
    it('should return a 404 for the user not found', () => {
      return request(app.getHttpServer())
        .patch('/users/:userId/discussions/:discussionId/mute')
        .expect({
          data: {}
        });
    });
    it('should return a 404 for the discussion not found', () => {
      return request(app.getHttpServer())
        .patch('/users/:userId/discussions/:discussionId/mute')
        .expect({
          data: {}
        });
    });
    it('should return a 404 for the discussion not found', () => {
      return request(app.getHttpServer())
        .patch('/users/:userId/discussions/:discussionId/mute')
        .expect({
          data: {}
        });
    });
    it('should return a 409 for the user already being muted', () => {
      return request(app.getHttpServer())
        .patch('/users/:userId/discussions/:discussionId/mute')
        .expect({
          data: {}
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});