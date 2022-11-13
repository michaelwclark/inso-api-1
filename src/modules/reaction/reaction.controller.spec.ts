import mongoose from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ReactionController } from './reaction.controller';
import { getModelToken } from '@nestjs/mongoose';
import { FakeDocuments, testingDatabase, TestingDatabase } from 'test/database';
import { DiscussionPost } from 'src/entities/post/post';
import { Reaction } from 'src/entities/reaction/reaction';
import { Discussion } from 'src/entities/discussion/discussion';
import { User } from 'src/entities/user/user';
import { NotificationService } from '../notification/notification.service';
import { MilestoneService } from '../milestone/milestone.service';
import { CreateReactionDTO } from 'src/entities/reaction/create-reaction';
import {
  makeFakeCreateReactionDTO,
  makeFakeUpdateReactionDTO,
} from './reaction-fakes';
import { IsReactionCreatorGuard } from 'src/auth/guards/userGuards/isReactionCreator.guard';
import REACTION_ERRORS from './reaction-errors';
import faker from 'test/faker';

describe('ReactionController', () => {
  let database: TestingDatabase;
  let reactionController: ReactionController;
  let fakeDocuments: FakeDocuments;
  let mockRequest: any;
  let mockNotificationService: any;
  let mockMilestoneService: any;
  let createReactionDTO: CreateReactionDTO;
  beforeAll(async () => {
    database = await testingDatabase();
    mockNotificationService = {
      createNotification: jest.fn(),
    };
    mockMilestoneService = {
      getMilestoneForUser: jest.fn(),
      createMilestoneForUser: jest.fn(),
    };
  });

  beforeEach(async () => {
    fakeDocuments = await database.createFakes();
    mockRequest = {
      user: {
        userId: fakeDocuments.user._id,
        username: fakeDocuments.user.username,
      },
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [ReactionController],
      providers: [
        {
          provide: getModelToken(DiscussionPost.name),
          useValue: database.post,
        },
        { provide: getModelToken(Reaction.name), useValue: database.reaction },
        {
          provide: getModelToken(Discussion.name),
          useValue: database.discussion,
        },
        { provide: getModelToken(User.name), useValue: database.user },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: MilestoneService, useValue: mockMilestoneService },
      ],
    })
      .overrideGuard(IsReactionCreatorGuard)
      .useValue({ canActivate: () => true })
      .compile();
    reactionController = app.get<ReactionController>(ReactionController);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await database.clearDatabase();
  });

  describe('POST /post/:postId/reaction', () => {
    describe('200 OK', () => {
      it('should create a reaction', async () => {
        createReactionDTO = makeFakeCreateReactionDTO({
          userId: fakeDocuments.user._id,
        });
        const result = await reactionController.createReaction(
          fakeDocuments.post._id.toString(),
          createReactionDTO,
          mockRequest,
        );

        expect(result).toMatchObject({
          __v: 0,
          _id: expect.any(mongoose.Types.ObjectId),
          reaction: createReactionDTO.reaction,
          postId: fakeDocuments.post._id,
          unified: createReactionDTO.unified,
          userId: fakeDocuments.user._id,
        });
      });

      it('should notify for upvote', async () => {
        createReactionDTO = makeFakeCreateReactionDTO({
          userId: fakeDocuments.user._id,
          reaction: '+1',
        });

        const result = await reactionController.createReaction(
          fakeDocuments.post._id.toString(),
          createReactionDTO,
          mockRequest,
        );

        expect(mockNotificationService.createNotification).toHaveBeenCalledWith(
          fakeDocuments.user._id, //Should be post User Id.
          createReactionDTO.userId,
          {
            header: expect.any(String),
            text: result.reaction,
            type: 'upvote',
          },
        );

        expect(result).toMatchObject({
          __v: 0,
          _id: expect.any(mongoose.Types.ObjectId),
          reaction: createReactionDTO.reaction,
          postId: fakeDocuments.post._id,
          unified: createReactionDTO.unified,
          userId: fakeDocuments.user._id,
        });
      });

      it('should notify for reaction', async () => {
        createReactionDTO = makeFakeCreateReactionDTO({
          userId: fakeDocuments.user._id,
        });

        const result = await reactionController.createReaction(
          fakeDocuments.post._id.toString(),
          createReactionDTO,
          mockRequest,
        );

        expect(mockNotificationService.createNotification).toHaveBeenCalledWith(
          fakeDocuments.user._id, //Should be post User Id.
          createReactionDTO.userId,
          {
            header: expect.any(String),
            text: result.reaction,
            type: 'reaction',
          },
        );

        expect(result).toMatchObject({
          __v: 0,
          _id: expect.any(mongoose.Types.ObjectId),
          reaction: createReactionDTO.reaction,
          postId: fakeDocuments.post._id,
          unified: createReactionDTO.unified,
          userId: fakeDocuments.user._id,
        });
      });

      it('should create milestone for users first upvote', async () => {
        createReactionDTO = makeFakeCreateReactionDTO({
          userId: fakeDocuments.user._id,
        });

        mockNotificationService.getMilestoneForUser = jest
          .fn()
          .mockResolvedValue(false);

        const result = await reactionController.createReaction(
          fakeDocuments.post._id.toString(),
          createReactionDTO,
          mockRequest,
        );

        expect(mockMilestoneService.getMilestoneForUser).toHaveBeenCalledWith(
          fakeDocuments.user._id, //Should be post User Id.
          '1st Upvote',
        );

        expect(
          mockMilestoneService.createMilestoneForUser,
        ).toHaveBeenCalledWith(
          fakeDocuments.user._id, //Should be post User Id.
          'reaction',
          '1st Upvote',
          {
            discussionId: fakeDocuments.discussion._id,
            postId: fakeDocuments.post._id,
            date: expect.any(Date),
          },
        );

        expect(result).toMatchObject({
          __v: 0,
          _id: expect.any(mongoose.Types.ObjectId),
          reaction: createReactionDTO.reaction,
          postId: fakeDocuments.post._id,
          unified: createReactionDTO.unified,
          userId: fakeDocuments.user._id,
        });
      });
    });

    describe('400 BAD REQUEST', () => {
      it('should throw an error if the post id is invalid', async () => {
        createReactionDTO = makeFakeCreateReactionDTO();

        await expect(
          reactionController.createReaction(
            'invalidId',
            createReactionDTO,
            mockRequest,
          ),
        ).rejects.toThrowError(REACTION_ERRORS.POST_ID_INVALID);
      });

      it('should throw error if the request user and reaction user do not match', async () => {
        createReactionDTO = makeFakeCreateReactionDTO({
          userId: fakeDocuments.user._id,
        });
        mockRequest.user.userId = faker.database.mongoObjectId();

        await expect(
          reactionController.createReaction(
            fakeDocuments.post._id.toString(),
            createReactionDTO,
            mockRequest,
          ),
        ).rejects.toThrowError(REACTION_ERRORS.USER_MISMATCH);
      });
    });

    describe('404 NOT FOUND', () => {
      it('should throw an error if the post does not exist', async () => {
        createReactionDTO = makeFakeCreateReactionDTO();

        await expect(
          reactionController.createReaction(
            faker.database.mongoObjectIdString(),
            createReactionDTO,
            mockRequest,
          ),
        ).rejects.toThrowError(REACTION_ERRORS.POST_NOT_FOUND);
      });

      it('should throw an error if the user does not exist', async () => {
        createReactionDTO = makeFakeCreateReactionDTO({
          userId: faker.database.mongoObjectId(),
        });

        await expect(
          reactionController.createReaction(
            fakeDocuments.post._id.toString(),
            createReactionDTO,
            mockRequest,
          ),
        ).rejects.toThrowError(REACTION_ERRORS.USER_NOT_FOUND);
      });
    });
  });

  describe('PATCH /post/:postId/reaction/:reactionId', () => {
    describe('200 OK', () => {
      it('should update the reaction', async () => {
        const updateReactionDTO = makeFakeUpdateReactionDTO();

        const result = await reactionController.updateReaction(
          fakeDocuments.post._id.toString(),
          fakeDocuments.reaction._id.toString(),
          updateReactionDTO,
        );
        expect(result).toMatchObject({
          _id: fakeDocuments.reaction._id,
          reaction: updateReactionDTO.reaction,
          unified: updateReactionDTO.unified,
        });
      });
    });

    describe('400 BAD REQUEST', () => {
      it('should throw an error if the post id is invalid', async () => {
        const updateReactionDTO = makeFakeUpdateReactionDTO();

        await expect(
          reactionController.updateReaction(
            'invalidId',
            fakeDocuments.reaction._id.toString(),
            updateReactionDTO,
          ),
        ).rejects.toThrowError(REACTION_ERRORS.POST_ID_INVALID);
      });
    });

    describe('404 NOT FOUND', () => {
      it('should throw if reaction is not found', async () => {
        const updateReactionDTO = makeFakeUpdateReactionDTO();

        await expect(
          reactionController.updateReaction(
            fakeDocuments.post._id.toString(),
            faker.database.mongoObjectIdString(),
            updateReactionDTO,
          ),
        ).rejects.toThrowError(REACTION_ERRORS.REACTION_NOT_FOUND);
      });
    });
  });

  describe('DELETE /post/:postId/reaction/:reactionId', () => {
    describe('200 OK', () => {
      it('should delete the reaction', async () => {
        const result = await reactionController.deletePostReaction(
          fakeDocuments.post._id.toString(),
          fakeDocuments.reaction._id.toString(),
        );

        expect(result).toMatchObject({
          acknowledged: true,
          deletedCount: 1,
        });
      });

      it('should not delete non-existant reaciton', async () => {
        const result = reactionController.deletePostReaction(
          fakeDocuments.post._id.toString(),
          faker.database.mongoObjectIdString(),
        );

        await expect(result).resolves.toMatchObject({
          acknowledged: true,
          deletedCount: 0,
        });
      });
    });

    describe('400 BAD REQUEST', () => {
      it('should throw an error if the post id is invalid', async () => {
        await expect(
          reactionController.deletePostReaction(
            'invalidId',
            fakeDocuments.reaction._id.toString(),
          ),
        ).rejects.toThrowError(REACTION_ERRORS.POST_ID_INVALID);
      });
    });
  });
});
