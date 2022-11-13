import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { IsDiscussionCreatorGuard } from 'src/auth/guards/userGuards/isDiscussionCreator.guard';
import { IsDiscussionFacilitatorGuard } from 'src/auth/guards/userGuards/isDiscussionFacilitator.guard';
import { IsDiscussionMemberGuard } from 'src/auth/guards/userGuards/isDiscussionMember.guard';
import { Calendar } from 'src/entities/calendar/calendar';
import { makeFakeSettingsCreateDTO } from 'src/entities/setting/setting-fakes';
import { Discussion } from 'src/entities/discussion/discussion';
import { Inspiration } from 'src/entities/inspiration/inspiration';
import { Score } from 'src/entities/score/score';
import { Setting } from 'src/entities/setting/setting';
import { DiscussionPost } from 'src/entities/post/post';
import { User } from 'src/entities/user/user';
import { DiscussionController } from '../discussion.controller';
import { Reaction } from 'src/entities/reaction/reaction';
import { Grade } from 'src/entities/grade/grade';
import { MilestoneService } from 'src/modules/milestone/milestone.service';
import { makeFakeUserPayload } from 'src/entities/user/user-fakes';
import { makeFakeInspirationPayload } from 'src/entities/inspiration/inspiration-fakes';
import {
  makeFakeDiscussionCreateDTO,
  makeFakeDiscussionEditDTO,
  makeFakeDiscussionPayload,
} from 'src/entities/discussion/discussion-fakes';
import faker from 'test/faker';
import { getUniqueInsoCode } from 'src/modules/shared/generateInsoCode';
import DISCUSSION_ERRORS from '../discussion-errors';
import { TestingDatabase, testingDatabase, FakeDocuments } from 'test/database';
import { DiscussionType } from 'src/entities/discussionType/discussion-type';

jest.mock('src/modules/shared/generateInsoCode');

describe('DiscussionController', () => {
  let database: TestingDatabase;
  let discussionController: DiscussionController;
  let fakeDocuments: FakeDocuments;
  let mockRequest: any;
  const mockMilestoneService = {
    getMilestoneForUser: jest.fn(),
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
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DiscussionController],
      providers: [
        {
          provide: getModelToken(Discussion.name),
          useValue: database.discussion,
        },
        { provide: getModelToken(Setting.name), useValue: database.setting },
        { provide: getModelToken(Score.name), useValue: database.score },
        {
          provide: getModelToken(Inspiration.name),
          useValue: database.inspiration,
        },
        { provide: getModelToken(User.name), useValue: database.user },
        { provide: getModelToken(Calendar.name), useValue: database.calendar },
        {
          provide: getModelToken(DiscussionPost.name),
          useValue: database.post,
        },
        { provide: getModelToken(Reaction.name), useValue: database.reaction },
        { provide: getModelToken(Grade.name), useValue: database.grade },
        {
          provide: getModelToken(DiscussionType.name),
          useValue: database.discussionType,
        },
        {
          provide: MilestoneService,
          useValue: mockMilestoneService,
        },
      ],
    })
      .overrideGuard(IsDiscussionCreatorGuard)
      .useValue({
        canActivate: () => true,
      })
      .overrideGuard(IsDiscussionMemberGuard)
      .useValue({
        canActivate: () => true,
      })
      .overrideGuard(IsDiscussionFacilitatorGuard)
      .useValue({
        canActivate: () => true,
      })
      .compile();

    discussionController = app.get<DiscussionController>(DiscussionController);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await database.clearDatabase();
  });

  describe('createDiscussion (POST /discussion)', () => {
    describe('200 OK', () => {
      it('should create discussion with unique new insoID', async () => {
        const discussionDTO = makeFakeDiscussionCreateDTO({
          poster: fakeDocuments.user._id,
          facilitators: [fakeDocuments.user._id],
        });
        const result = await discussionController.createDiscussion(
          discussionDTO,
          mockRequest,
        );
        expect(result).toMatchObject(discussionDTO);
        expect(getUniqueInsoCode).toHaveBeenCalled();
      });

      it('should create a discussion and discussion setting with all existing inspirations', async () => {
        const discussionDTO = makeFakeDiscussionCreateDTO({
          poster: fakeDocuments.user._id,
          facilitators: [fakeDocuments.user._id],
        });
        const result = await discussionController.createDiscussion(
          discussionDTO,
          mockRequest,
        );
        const newSettings = await database.setting.findById(result.settings);
        expect(newSettings.post_inspirations).toHaveLength(1);
        expect(newSettings.post_inspirations[0]).toEqual(
          fakeDocuments.inspiration._id,
        );

        const newInspiration = await database.inspiration.create(
          makeFakeInspirationPayload(),
        );
        const result2 = await discussionController.createDiscussion(
          discussionDTO,
          mockRequest,
        );
        const newSettings2 = await database.setting.findById(result2.settings);
        expect(newSettings2.post_inspirations).toHaveLength(2);
        expect(newSettings2.post_inspirations[0]).toEqual(
          fakeDocuments.inspiration._id,
        );
        expect(newSettings2.post_inspirations[1]).toEqual(newInspiration._id);
      });

      it('should create milestone for Discussion Created if it does not exist for user', async () => {
        const discussionDTO = makeFakeDiscussionCreateDTO({
          poster: fakeDocuments.user._id,
          facilitators: [fakeDocuments.user._id],
        });
        const result = await discussionController.createDiscussion(
          discussionDTO,
          mockRequest,
        );
        expect(result).toMatchObject(discussionDTO);
        expect(mockMilestoneService.getMilestoneForUser).toHaveBeenCalledWith(
          fakeDocuments.user._id,
          'Discussion Created',
        );
        expect(
          mockMilestoneService.createMilestoneForUser,
        ).toHaveBeenCalledWith(
          fakeDocuments.user._id,
          'discussion',
          'Discussion Created',
          {
            discussionId: result._id,
            postId: null,
            date: expect.any(Date),
          },
        );
      });

      it('should not create milestone for Discussion Created if it does exist for user', async () => {
        const discussionDTO = makeFakeDiscussionCreateDTO({
          poster: fakeDocuments.user._id,
          facilitators: [fakeDocuments.user._id],
        });
        mockMilestoneService.getMilestoneForUser.mockResolvedValueOnce(
          "I'm a milestone",
        );
        const result = await discussionController.createDiscussion(
          discussionDTO,
          mockRequest,
        );
        expect(result).toMatchObject(discussionDTO);
        expect(mockMilestoneService.getMilestoneForUser).toHaveBeenCalledWith(
          fakeDocuments.user._id,
          'Discussion Created',
        );
        expect(
          mockMilestoneService.createMilestoneForUser,
        ).toHaveBeenCalledTimes(0);
      });

      it('should create and return a valid discussion', async () => {
        const discussionDTO = makeFakeDiscussionCreateDTO({
          poster: fakeDocuments.user._id,
          facilitators: [fakeDocuments.user._id],
        });

        const result = await discussionController.createDiscussion(
          discussionDTO,
          mockRequest,
        );
        expect(result).toMatchObject(discussionDTO);
      });
    });

    describe('404 Errors', () => {
      it('poster not found', () => {
        const discussionDTO = makeFakeDiscussionCreateDTO({
          poster: faker.database.mongoObjectId(),
          facilitators: [fakeDocuments.user._id],
        });

        return expect(
          discussionController.createDiscussion(discussionDTO, mockRequest),
        ).rejects.toThrow(DISCUSSION_ERRORS.USER_NOT_FOUND);
      });

      it('facilitator not found', () => {
        const discussionDTO = makeFakeDiscussionCreateDTO({
          poster: fakeDocuments.user._id,
          facilitators: [faker.database.mongoObjectId()],
        });

        return expect(
          discussionController.createDiscussion(discussionDTO, mockRequest),
        ).rejects.toThrow(DISCUSSION_ERRORS.FACILITATOR_NOT_FOUND);
      });
    });

    describe('400 Errors', () => {
      it('request user not matching poster', async () => {
        const user2 = await database.user.create(makeFakeUserPayload());
        const discussionDTO = makeFakeDiscussionCreateDTO({
          poster: user2._id,
          facilitators: [fakeDocuments.user._id],
        });

        return expect(
          discussionController.createDiscussion(discussionDTO, mockRequest),
        ).rejects.toThrow(DISCUSSION_ERRORS.DISCUSSION_POSTER_MISMATCH);
      });
    });
  });

  describe('updateDiscussionMetadata (PATCH discussion/:discussionId/metadata)', () => {
    describe('200 OK', () => {
      it('should update discussion metadata and return updated discussion', async () => {
        const discussionEditDTO = makeFakeDiscussionEditDTO({
          facilitators: [fakeDocuments.user._id],
          participants: undefined,
        });
        const result = await discussionController.updateDiscussionMetadata(
          fakeDocuments.discussion._id.toString(),
          discussionEditDTO,
        );
        expect(result.facilitators).toMatchObject(
          discussionEditDTO.facilitators,
        );
        expect(result.participants).toMatchObject(
          fakeDocuments.discussion.participants,
        );
      });
    });

    describe('404 Errors', () => {
      it('discussion not found', async () => {
        const discussionEditDTO = makeFakeDiscussionEditDTO({
          facilitators: [fakeDocuments.user._id],
          participants: undefined,
        });
        return expect(
          discussionController.updateDiscussionMetadata(
            faker.database.mongoObjectIdString(),
            discussionEditDTO,
          ),
        ).rejects.toThrow(DISCUSSION_ERRORS.DISCUSSION_NOT_FOUND);
      });

      it('facilitator user not found', async () => {
        const discussionEditDTO = makeFakeDiscussionEditDTO({
          facilitators: [faker.database.mongoObjectId()],
          participants: undefined,
        });
        return expect(
          discussionController.updateDiscussionMetadata(
            fakeDocuments.discussion._id.toString(),
            discussionEditDTO,
          ),
        ).rejects.toThrow(DISCUSSION_ERRORS.FACILITATOR_NOT_FOUND);
      });
    });

    describe('400 Errors', () => {
      it('adding participant', async () => {
        const discussionEditDTO = makeFakeDiscussionEditDTO({
          facilitators: [fakeDocuments.user._id],
          participants: [fakeDocuments.user._id],
        });
        return expect(
          discussionController.updateDiscussionMetadata(
            fakeDocuments.discussion._id.toString(),
            discussionEditDTO,
          ),
        ).rejects.toThrow(DISCUSSION_ERRORS.CAN_NOT_EDIT_PARTICIPANTS);
      });
    });
  });

  describe('getDiscussion (GET discussion/:discussionId)', () => {
    describe('200 OK', () => {
      // TODO: Better testing and breaking out of this monstosity and the ReadDTO
      it('should return discussion', async () => {
        const result = await discussionController.getDiscussion(
          fakeDocuments.discussion._id.toString(),
        );

        expect(result).toMatchObject({
          archived: fakeDocuments.discussion.archived,
          created: fakeDocuments.discussion.created,
          insoCode: fakeDocuments.discussion.insoCode,
          keywords: fakeDocuments.discussion.keywords,
          name: fakeDocuments.discussion.name,
          participants: [
            {
              f_name: fakeDocuments.user.f_name,
              l_name: fakeDocuments.user.l_name,
              username: fakeDocuments.user.username,
            },
          ],
          poster: {
            f_name: fakeDocuments.user.f_name,
            l_name: fakeDocuments.user.l_name,
            username: fakeDocuments.user.username,
          },
          posts: [],
          settings: {
            calendar: {
              close: fakeDocuments.calendar.close.toString(),
              open: fakeDocuments.calendar.open.toString(),
            },
            // post_inspiration: setting.post_inspirations,
            scores: {
              active_days: {
                max_points: fakeDocuments.score.active_days.max_points,
                required: fakeDocuments.score.active_days.required,
              },
              comments_received: {
                max_points: fakeDocuments.score.comments_received.max_points,
                required: fakeDocuments.score.comments_received.required,
              },
              criteria: [
                {
                  criteria: fakeDocuments.score.criteria[0].criteria,
                  max_points: fakeDocuments.score.criteria[0].max_points,
                },
                {
                  criteria: fakeDocuments.score.criteria[1].criteria,
                  max_points: fakeDocuments.score.criteria[1].max_points,
                },
              ],
              post_inspirations: {
                max_points: fakeDocuments.score.post_inspirations.max_points,
                selected: fakeDocuments.score.post_inspirations.selected,
              },

              posts_made: {
                max_points: fakeDocuments.score.posts_made.max_points,
                required: fakeDocuments.score.posts_made.required,
              },
            },
            starter_prompt: fakeDocuments.setting.starter_prompt,
          },
        });
      });
    });

    describe('404 Errors', () => {
      it('discussion not found', async () => {
        return expect(
          discussionController.getDiscussion(
            faker.database.mongoObjectIdString(),
          ),
        ).rejects.toThrow(DISCUSSION_ERRORS.DISCUSSION_NOT_FOUND);
      });
    });

    describe('400 Errors', () => {
      it('discussion id invalid', async () => {
        return expect(
          discussionController.getDiscussion('invalid'),
        ).rejects.toThrow(DISCUSSION_ERRORS.DISCUSSION_ID_INVALID);
      });
    });
  });

  describe('archiveDiscussion (POST discussion/:discussionId/archive)', () => {
    describe('200 OK', () => {
      it('should archive discussion', async () => {
        const result = await discussionController.archiveDiscussion(
          fakeDocuments.discussion._id.toString(),
        );
        expect(result).toMatchObject({ archived: expect.any(Date) });
      });
    });

    describe('400 Errors', () => {
      it('discussion id invalid', async () => {
        return expect(
          discussionController.archiveDiscussion('invalid'),
        ).rejects.toThrow(DISCUSSION_ERRORS.DISCUSSION_ID_INVALID);
      });
    });
  });

  describe('duplicateDiscussion (POST discussion/:discussionId/duplicate)', () => {
    describe('200 OK', () => {
      it('should duplicate discussion', async () => {
        const result = await discussionController.duplicateDiscussion(
          fakeDocuments.discussion._id.toString(),
        );
        expect(result).toMatchObject({
          name: fakeDocuments.discussion.name,
          facilitators: fakeDocuments.discussion.facilitators,
          settings: fakeDocuments.discussion.settings,
          poster: fakeDocuments.discussion.poster,
        });
        expect(getUniqueInsoCode).toBeCalledTimes(1);
      });
    });

    describe('404 Errors', () => {
      it('discussion not found', async () => {
        return expect(
          discussionController.duplicateDiscussion(
            faker.database.mongoObjectIdString(),
          ),
        ).rejects.toThrow(DISCUSSION_ERRORS.DISCUSSION_NOT_FOUND);
      });
    });

    describe('400 Errors', () => {
      it('discussion id invalid', async () => {
        return expect(
          discussionController.duplicateDiscussion('invalid'),
        ).rejects.toThrow(DISCUSSION_ERRORS.DISCUSSION_ID_INVALID);
      });
    });
  });

  describe('getDiscussions (GET users/:userId/discussions)', () => {
    describe('200 OK', () => {
      it('should return discussions', async () => {
        return;
      });
    });

    describe('404 Errors', () => {
      it('user not found', async () => {
        return expect(
          discussionController.getDiscussions(
            faker.database.mongoObjectIdString(),
            'false',
            'false',
            mockRequest,
            undefined,
            undefined,
            undefined,
          ),
        ).rejects.toThrow(DISCUSSION_ERRORS.USER_NOT_FOUND);
      });
    });

    describe('400 Errors', () => {
      it('user id invalid', async () => {
        return expect(
          discussionController.getDiscussions(
            'invalid',
            'false',
            'false',
            mockRequest,
            undefined,
            undefined,
            undefined,
          ),
        ).rejects.toThrow(DISCUSSION_ERRORS.USER_ID_INVALID);
      });

      it('user auth mismatch', async () => {
        const user2 = await database.user.create(makeFakeUserPayload());
        return expect(
          discussionController.getDiscussions(
            user2._id.toString(),
            'false',
            'false',
            mockRequest,
            undefined,
            undefined,
            undefined,
          ),
        ).rejects.toThrow(DISCUSSION_ERRORS.USER_ID_AUTHENTICATION_MISMATCH);
      });
    });
  });

  describe('getDiscussionStats (GET users/:userId/discussions/statistics)', () => {
    describe('200 OK', () => {
      it('should return discussion statistics', async () => {
        return;
      });
    });

    describe('404 Errors', () => {
      it('user not found', async () => {
        return;
      });
    });

    describe('400 Errors', () => {
      it('user id invalid', async () => {
        return;
      });
    });
  });

  describe('updateDiscussionSettings (PATCH discussion/:discussionId/settings)', () => {
    describe('200 OK', () => {
      it('should update discussion settings and return updated discussion', async () => {
        const settingsCreateDTO = makeFakeSettingsCreateDTO({
          score: fakeDocuments.score._id,
          calendar: fakeDocuments.calendar._id,
          post_inspirations: [fakeDocuments.inspiration._id],
        });
        return expect(
          discussionController.updateDiscussionSettings(
            settingsCreateDTO,
            fakeDocuments.discussion._id.toString(),
          ),
        ).resolves.not.toThrow();
      });
    });

    describe('404 Errors', () => {
      it('discussion not found', async () => {
        const settingsCreateDTO = makeFakeSettingsCreateDTO();
        const nonExistantDiscussionId = faker.database.mongoObjectIdString();

        return expect(
          discussionController.updateDiscussionSettings(
            settingsCreateDTO,
            nonExistantDiscussionId,
          ),
        ).rejects.toThrow(DISCUSSION_ERRORS.DISCUSSION_NOT_FOUND);
      });

      it('post inspiration not found', async () => {
        const settingsCreateDTO = makeFakeSettingsCreateDTO({
          ...fakeDocuments.setting.toObject(),
          post_inspirations: [faker.database.mongoObjectId()],
        });

        return expect(
          discussionController.updateDiscussionSettings(
            settingsCreateDTO,
            fakeDocuments.discussion._id.toString(),
          ),
        ).rejects.toThrow(DISCUSSION_ERRORS.POST_INSPIRATION_NOT_FOUND);
      });

      it('calander not found', async () => {
        const settingsCreateDTO = makeFakeSettingsCreateDTO({
          ...fakeDocuments.setting.toObject(),
          calendar: faker.database.mongoObjectId(),
        });

        return expect(
          discussionController.updateDiscussionSettings(
            settingsCreateDTO,
            fakeDocuments.discussion._id.toString(),
          ),
        ).rejects.toThrow(DISCUSSION_ERRORS.CALENDAR_NOT_FOUND);
      });
    });

    describe('400 Errors', () => {
      it('adding participant', async () => {
        return;
      });
    });
  });

  describe('joinDiscussion (PATCH /users/:userId/discussions/:insoCode/join)', () => {
    describe('200 OK', () => {
      it('should join discussion', async () => {
        const discussion = await database.discussion.create(
          makeFakeDiscussionPayload({
            archived: null,
            settings: fakeDocuments.setting._id,
            poster: fakeDocuments.user._id,
          }),
        );
        const results = await discussionController.joinDiscussion(
          fakeDocuments.user._id.toString(),
          discussion.insoCode,
        );

        expect(results.participants).toContainEqual({
          user: fakeDocuments.user._id,
          joined: expect.any(Date),
          muted: false,
          grade: null,
        });
      });
    });

    describe('409 Errors', () => {
      it('user already in discussion', async () => {
        await expect(
          discussionController.joinDiscussion(
            fakeDocuments.user._id.toString(),
            fakeDocuments.discussion.insoCode,
          ),
        ).rejects.toThrowError(DISCUSSION_ERRORS.USER_ALREADY_IN_DISCUSSION);
      });
    });
    describe('404 Errors', () => {
      it('discussion not found', async () => {
        await expect(
          discussionController.joinDiscussion(
            fakeDocuments.user._id.toString(),
            faker.datatype.string(5),
          ),
        ).rejects.toThrowError(DISCUSSION_ERRORS.DISCUSSION_NOT_FOUND);
      });

      it('user not found', async () => {
        await expect(
          discussionController.joinDiscussion(
            faker.database.mongoObjectIdString(),
            fakeDocuments.discussion.insoCode,
          ),
        ).rejects.toThrowError(DISCUSSION_ERRORS.USER_NOT_FOUND);
      });
    });

    describe('400 Errors', () => {
      it('insoCode is invalid', async () => {
        await expect(
          discussionController.joinDiscussion(
            fakeDocuments.user._id.toString(),
            faker.datatype.string(6),
          ),
        ).rejects.toThrowError(DISCUSSION_ERRORS.INSO_CODE_INVALID);
      });

      it('user id invalid', async () => {
        await expect(
          discussionController.joinDiscussion(
            faker.datatype.string(6),
            fakeDocuments.discussion.insoCode,
          ),
        ).rejects.toThrowError(DISCUSSION_ERRORS.USER_ID_INVALID);
      });
    });
  });

  describe('removeParticipant (PATCH discussions/:discussionId/participants/:participantId/remove)', () => {
    describe('200 OK', () => {
      it('should remove participant', async () => {
        const results = await discussionController.removeParticipant(
          fakeDocuments.discussion._id.toString(),
          fakeDocuments.user._id.toString(),
        );

        expect(results.participants).not.toContainEqual({
          user: fakeDocuments.user._id,
          joined: expect.any(Date),
          muted: false,
          grade: null,
        });
      });
    });

    describe('400 Errors', () => {
      it('participant not memeber', async () => {
        await expect(
          discussionController.removeParticipant(
            fakeDocuments.discussion._id.toString(),
            faker.database.mongoObjectIdString(),
          ),
        ).rejects.toThrowError(DISCUSSION_ERRORS.PARTICIPANT_NOT_IN_DISUCSSION);
      });
    });
  });

  describe('addTag (POST discussions/:discussionId/tags)', () => {
    describe('200 OK', () => {
      it('should add tag', async () => {
        const tag = faker.datatype.string();
        const results = await discussionController.addTag(
          fakeDocuments.discussion._id.toString(),
          tag,
        );

        expect(results.tags).toContainEqual(tag);
      });
    });

    describe('404 Errors', () => {
      it('discussion does not exist', async () => {
        await expect(
          discussionController.addTag(
            faker.database.mongoObjectIdString(),
            faker.datatype.string(),
          ),
        ).rejects.toThrowError(DISCUSSION_ERRORS.DISCUSSION_NOT_FOUND);
      });
    });

    describe('400 Errors', () => {
      it('tag already exists', async () => {
        await expect(
          discussionController.addTag(
            fakeDocuments.discussion._id.toString(),
            fakeDocuments.discussion.tags[0],
          ),
        ).rejects.toThrowError(DISCUSSION_ERRORS.DUPLICATE_TAG);
      });
    });
  });

  describe('muteUserInDiscussion (PATCH users/:userId/discussions/:discussionId/mute)', () => {
    describe('200 OK', () => {
      it('should mute user', async () => {
        const unmutedDiscussion = await database.discussion.create(
          makeFakeDiscussionPayload({
            archived: null,
            settings: fakeDocuments.setting._id,
            poster: fakeDocuments.user._id,
            participants: [
              {
                user: fakeDocuments.user._id,
                joined: new Date(),
                muted: false,
                grade: null,
              },
            ],
          }),
        );

        const result = await discussionController.muteUserInDiscussion(
          fakeDocuments.user._id.toString(),
          unmutedDiscussion._id.toString(),
        );

        expect(result.participants).toContainEqual({
          user: fakeDocuments.user._id,
          joined: expect.any(Date),
          muted: true,
          grade: null,
        });
      });
    });

    describe('404 Errors', () => {
      it('discussion does not exist', async () => {
        await expect(
          discussionController.muteUserInDiscussion(
            fakeDocuments.user._id.toString(),
            faker.database.mongoObjectIdString(),
          ),
        ).rejects.toThrowError(DISCUSSION_ERRORS.DISCUSSION_NOT_FOUND);
      });
      it('user not in discussion', async () => {
        await expect(
          discussionController.muteUserInDiscussion(
            faker.database.mongoObjectIdString(),
            fakeDocuments.discussion._id.toString(),
          ),
        ).rejects.toThrowError(DISCUSSION_ERRORS.USER_NOT_FOUND);
      });
    });
  });

  describe('400 Errors', () => {
    it('user id invalid', async () => {
      await expect(
        discussionController.muteUserInDiscussion(
          faker.datatype.string(6),
          fakeDocuments.discussion._id.toString(),
        ),
      ).rejects.toThrowError(DISCUSSION_ERRORS.USER_ID_INVALID);
    });

    it('discussion id invalid', async () => {
      await expect(
        discussionController.muteUserInDiscussion(
          fakeDocuments.user._id.toString(),
          faker.datatype.string(6),
        ),
      ).rejects.toThrowError(DISCUSSION_ERRORS.DISCUSSION_ID_INVALID);
    });
  });

  describe('deleteDiscussion (DELETE discussion/:discussionId)', () => {
    describe('200 OK', () => {
      it('should delete discussion', async () => {
        const emptyDiscussion = await database.discussion.create(
          makeFakeDiscussionPayload(),
        );
        return expect(
          discussionController.deleteDiscussion(emptyDiscussion._id.toString()),
        ).resolves.not.toThrow();
      });
    });

    describe('409 Errors', () => {
      it('discussion has posts', async () => {
        await database.post.create({
          discussionId: fakeDocuments.discussion._id,
        });
        await expect(
          discussionController.deleteDiscussion(
            fakeDocuments.discussion._id.toString(),
          ),
        ).rejects.toThrowError(DISCUSSION_ERRORS.DISCUSSION_HAS_POSTS);
      });
    });
  });

  afterAll((done) => {
    // Closing the DB connection allows Jest to exit successfully.
    database.connection.close();
    done();
  });
});
