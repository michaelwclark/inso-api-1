import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { PostModule } from '../src/modules/post/post.module';

describe('AppController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PostModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('POST discussion/:discussionId/post', () => {
    it('should return a 200 for a valid post', () => {
      return request(app.getHttpServer()).post('/discussion/123/post').expect({
        data: {},
      });
    });
    it('should return a 400 for an invalid discussionId', () => {});
    it('should return a 400 for an invalid userId', () => {});
    it('should return a 400 for an invalid draft state', () => {});
    it('should return a 400 for an invalid comment_for', () => {});
    it('should return a 400 for an invalid post', () => {});
    it('should return a 400 for an invalid post_inspiration', () => {});
    it('should return a 401 for a user without a token', () => {});
    it('should return a 403 for a user that is not a participant in the discussion', () => {});
    it('should return a 404 for a comment_for post that does not exist', () => {});
    it('should return a 404 for a discussion that was not found', () => {});
  });

  describe('PATCH discussion/:discussionId/post/:postId', () => {
    it('should return a 200 for a valid post update', () => {});
    it('should return a 400 for an invalid discussionId', () => {});
    it('should return a 400 for an invalid postId', () => {});
    it('should return a 400 for an invalid post_inspirationId', () => {});
    it('should return a 400 for an empty post', () => {});
    it('should return a 400 for an undefined post', () => {});
    it('should return a 400 for a null post', () => {});
    it('should return a 400 for a bad post_inspiration update', () => {});
    it('should return a 401 for a user without a token', () => {});
    it('should return a 401 for a user without a token', () => {});
    it('should return a 403 for a user token that is not the author of the post', () => {});
    it('should return a 404 for discussion not found', () => {});
    it('should return a 404 for post not found', () => {});
    it('should return a 404 for a nonexistent post_inspiration', () => {});
  });

  afterAll(async () => {
    await app?.close();
  });
});
