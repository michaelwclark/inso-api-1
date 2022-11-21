import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IsDiscussionFacilitatorGuard } from 'src/auth/guards/userGuards/isDiscussionFacilitator.guard';
import { IsDiscussionMemberGuard } from 'src/auth/guards/userGuards/isDiscussionMember.guard';
import { IsPostCreatorGuard } from 'src/auth/guards/userGuards/isPostCreator.guard';
import { Discussion } from 'src/entities/discussion/discussion';
import { makeFakeDiscussionPayload } from 'src/entities/discussion/discussion-fakes';
import { Inspiration } from 'src/entities/inspiration/inspiration';
import { DiscussionPost } from 'src/entities/post/post';
import { makeFakePostCreateDTO } from 'src/entities/post/post-fakes';
import { Reaction } from 'src/entities/reaction/reaction';
import { Setting } from 'src/entities/setting/setting';
import { User } from 'src/entities/user/user';
import { testingDatabase, TestingDatabase, FakeDocuments } from 'test/database';
import faker from 'test/faker';
import { MilestoneService } from '../milestone/milestone.service';
import { NotificationService } from '../notification/notification.service';
import { PostController } from './post.controller';
import POST_ERRORS from './post-errors';

describe('PostController', () => {
  let controller: PostController;
  let database: TestingDatabase;

  let fakeDocuments: FakeDocuments;
  let mockRequest: any;
  const mockNotificationService = {};
  const mockMilestoneService = {
    createMilestoneForUser: jest.fn(),
  };
  beforeAll(async () => {
    database = await testingDatabase();
  });

  beforeEach(async () => {
    fakeDocuments = await database.createFakes();

    mockRequest = {
      user: {
        userId: fakeDocuments.user._id,
        username: fakeDocuments.user.username,
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: getModelToken(Discussion.name),
          useValue: database.discussion,
        },
        {
          provide: getModelToken(DiscussionPost.name),
          useValue: database.post,
        },
        {
          provide: getModelToken(Inspiration.name),
          useValue: database.inspiration,
        },
        {
          provide: getModelToken(Setting.name),
          useValue: database.setting,
        },
        {
          provide: getModelToken(User.name),
          useValue: database.user,
        },
        {
          provide: getModelToken(Reaction.name),
          useValue: database.reaction,
        },
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
        {
          provide: MilestoneService,
          useValue: mockMilestoneService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: () => true,
      })
      .overrideGuard(IsDiscussionMemberGuard)
      .useValue({
        canActivate: () => true,
      })
      .overrideGuard(IsPostCreatorGuard)
      .useValue({
        canActivate: () => true,
      })
      .overrideGuard(IsDiscussionFacilitatorGuard)
      .useValue({
        canActivate: () => true,
      })

      .compile();

    controller = module.get<PostController>(PostController);
  });

  afterEach(async () => {
    await database.clearDatabase();
    jest.clearAllMocks();
  });

  describe('createPost (POST discussion/:discussionId/post)', () => {
    describe('200 OK', () => {
      it('should create a new post', async () => {
        const discussion = await database.discussion.create(
          makeFakeDiscussionPayload({
            archived: null,
            settings: fakeDocuments.setting._id,
            poster: fakeDocuments.user._id,
            participants: [
              {
                user: fakeDocuments.user._id,
                joined: faker.date.past(),
                muted: false,
                grade: fakeDocuments.grade._id,
              },
            ],
          }),
        );

        const post = makeFakePostCreateDTO({
          comment_for: null,
        });
        const response = await controller.createPost(
          discussion._id.toString(),
          post,
          mockRequest,
        );
        expect(response).toBeDefined();
        expect(response).toHaveProperty('post');
      });
    });

    describe('400 BAD REQUEST', () => {
      it('should throw an error if the discussion is archived', async () => {
        const discussion = await database.discussion.create(
          makeFakeDiscussionPayload({
            archived: faker.date.past(),
            settings: fakeDocuments.setting._id,
            poster: fakeDocuments.user._id,
            participants: [
              {
                user: fakeDocuments.user._id,
                joined: faker.date.past(),
                muted: false,
                grade: fakeDocuments.grade._id,
              },
            ],
          }),
        );

        const post = makeFakePostCreateDTO({
          comment_for: null,
        });
        await expect(
          controller.createPost(discussion._id.toString(), post, mockRequest),
        ).rejects.toThrowError(POST_ERRORS.DISCUSSION_ARCHIVED);
      });

      it('should throw an error if the participant is muted', async () => {
        const discussion = await database.discussion.create(
          makeFakeDiscussionPayload({
            archived: null,
            settings: fakeDocuments.setting._id,
            poster: fakeDocuments.user._id,
            participants: [
              {
                user: fakeDocuments.user._id,
                joined: faker.date.past(),
                muted: true,
                grade: fakeDocuments.grade._id,
              },
            ],
          }),
        );

        const post = makeFakePostCreateDTO({
          comment_for: null,
        });
        await expect(
          controller.createPost(discussion._id.toString(), post, mockRequest),
        ).rejects.toThrowError(POST_ERRORS.USER_MUTED);
      });
    });
  });
});
