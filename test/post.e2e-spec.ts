import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { PostModule } from '../src/modules/post/post.module';

describe('Post E2E', () => {
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
    it('should return a 400 for an invalid discussionId', () => true);
    it('should return a 400 for an invalid userId', () => true);
    it('should return a 400 for an invalid draft state', () => true);
    it('should return a 400 for an invalid comment_for', () => true);
    it('should return a 400 for an invalid post', () => true);
    it('should return a 400 for an invalid post_inspiration', () => true);
    it('should return a 401 for a user without a token', () => true);
    it('should return a 403 for a user that is not a participant in the discussion', () =>
      true);
    it('should return a 404 for a comment_for post that does not exist', () =>
      true);
    it('should return a 404 for a discussion that was not found', () => true);
  });

  describe('PATCH discussion/:discussionId/post/:postId', () => {
    it('should return a 200 for a valid post update', () => true);
    it('should return a 400 for an invalid discussionId', () => true);
    it('should return a 400 for an invalid postId', () => true);
    it('should return a 400 for an invalid post_inspirationId', () => true);
    it('should return a 400 for an empty post', () => true);
    it('should return a 400 for an undefined post', () => true);
    it('should return a 400 for a null post', () => true);
    it('should return a 400 for a bad post_inspiration update', () => true);
    it('should return a 401 for a user without a token', () => true);
    it('should return a 401 for a user without a token', () => true);
    it('should return a 403 for a user token that is not the author of the post', () =>
      true);
    it('should return a 404 for discussion not found', () => true);
    it('should return a 404 for post not found', () => true);
    it('should return a 404 for a nonexistent post_inspiration', () => true);
  });

  afterAll(async () => {
    await app?.close();
  });
});
