import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';

describe('AppController', () => {
  let appController: PostController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [],
    }).compile();

    appController = app.get<PostController>(PostController);
  });

  describe('POST discussion/:discussionId/post', () => {
    it('should return a 200 for a valid post', () => {

    });
    it('should return a 400 for an invalid discussionId', () => {
      
    });
    it('should return a 400 for an invalid userId', () => {

    });
    it('should return a 400 for an invalid draft state', () => {

    });
    it('should return a 400 for an invalid comment_for', () => {

    });
    it('should return a 400 for an invalid post', () => {

    });
    it('should return a 400 for an invalid post_inspiration', () => {

    });
    it('should return a 401 for a user without a token', () => {

    });
    it('should return a 403 for a user that is not a participant in the discussion', () => {

    });
    it('should return a 404 for a comment_for post that does not exist', () => {

    });
    it('should return a 404 for a discussion that was not found', () => {

    });
  });

  describe('PATCH discussion/:discussionId/post/:postId', () => {
    it('should return a 200 for a valid post update', () => {

    });
    it('should return a 400 for an invalid discussionId', () => {
      
    });
    it('should return a 400 for an invalid postId', () => {
      
    });
    it('should return a 400 for an invalid post_inspirationId', () => {
      
    });
    it('should return a 400 for an empty post', () => {
      
    });
    it('should return a 400 for an undefined post', () => {
      
    });
    it('should return a 400 for a null post', () => {
      
    });
    it('should return a 400 for a bad post_inspiration update', () => {
      
    });
    it('should return a 401 for a user without a token', () => {
      
    });
    it('should return a 401 for a user without a token', () => {
      
    });
    it('should return a 403 for a user token that is not the author of the post', () => {
      
    });
    it('should return a 404 for discussion not found', () => {
      
    });
    it('should return a 404 for post not found', () => {
      
    });
    it('should return a 404 for a nonexistent post_inspiration', () => {
      
    });
  })
});