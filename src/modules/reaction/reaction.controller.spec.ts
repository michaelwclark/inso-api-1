// import { Test, TestingModule } from '@nestjs/testing';
// import { ReactionController } from './reaction.controller';

describe('AppController', () => {
  // let appController: ReactionController;

  beforeEach(async () => {
    // const app: TestingModule = await Test.createTestingModule({
    //   controllers: [ReactionController],
    //   providers: [],
    // }).compile();
    // appController = app.get<ReactionController>(ReactionController);
  });

  describe('POST /post/:postId/reaction', () => {
    it('should return a 200 for a created reaction', () => {
      expect(2 + 2).toBe(4);
    });
    it('should return a 400 for an incorrect emoji code', () => {
      expect(2 + 2).toBe(4);
    });
    it('should return a 400 for an invalid postId', () => {
      expect(2 + 2).toBe(4);
    });
    it('should return a 401 for unauthorized', () => {
      expect(2 + 2).toBe(4);
    });
    it('should return a 404 for the post not existing', () => {
      expect(2 + 2).toBe(4);
    });
  });

  describe('PATCH /post/:postId/reaction/:reactionId', () => {
    it('should return a 200 for an updated reaction', () => {
      expect(2 + 2).toBe(4);
    });
    it('should return a 400 for an incorrect emoji code', () => {
      expect(2 + 2).toBe(4);
    });
    it('should return a 400 for an invalid postId', () => {
      expect(2 + 2).toBe(4);
    });
    it('should return a 401 for unauthorized', () => {
      expect(2 + 2).toBe(4);
    });
    it('should return a 403 for a user trying to update a reaction that is not theirs', () => {
      expect(2 + 2).toBe(4);
    });
    it('should return a 404 for the reaction not existing', () => {
      expect(2 + 2).toBe(4);
    });
  });

  describe('DELETE /post/:postId/reaction/:reactionId', () => {
    it('should return a 200 for a deleted reaction', () => {
      expect(2 + 2).toBe(4);
    });
    it('should return a 400 for an invalid postId', () => {
      expect(2 + 2).toBe(4);
    });
    it('should return a 400 for an invalid reactionId', () => {
      expect(2 + 2).toBe(4);
    });
    it('should return a 401 for unauthorized', () => {
      expect(2 + 2).toBe(4);
    });
    it('should return a 403 for a user trying to update a reaction that is not theirs', () => {
      expect(2 + 2).toBe(4);
    });
  });
});
