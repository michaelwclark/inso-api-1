import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { HydratedDocument } from 'mongoose';
import { connect, Connection, Model, Types } from 'mongoose';
import { IsDiscussionCreatorGuard } from 'src/auth/guards/userGuards/isDiscussionCreator.guard';
import { IsDiscussionFacilitatorGuard } from 'src/auth/guards/userGuards/isDiscussionFacilitator.guard';
import { IsDiscussionMemberGuard } from 'src/auth/guards/userGuards/isDiscussionMember.guard';
import { Calendar, CalendarSchema } from 'src/entities/calendar/calendar';
import { makeFakeCalendarPayload } from 'src/entities/calendar/calendar-fakes';
import {
  makeFakeSettingPayload,
  makeFakeSettingsCreateDTO,
} from 'src/entities/setting/setting-fakes';
import {
  Discussion,
  DiscussionSchema,
} from 'src/entities/discussion/discussion';
import {
  Inspiration,
  InspirationSchema,
} from 'src/entities/inspiration/inspiration';
import { Score, ScoreSchema } from 'src/entities/score/score';
import { Setting, SettingSchema } from 'src/entities/setting/setting';
import { DiscussionPost, DiscussionPostSchema } from 'src/entities/post/post';
import { User, UserSchema } from 'src/entities/user/user';
import { DiscussionController } from '../discussion.controller';
import { Reaction, ReactionSchema } from 'src/entities/reaction/reaction';
import { Grade, GradeSchema } from 'src/entities/grade/grade';
import { MilestoneService } from 'src/modules/milestone/milestone.service';
import { makeFakeUserPayload } from 'src/entities/user/user-fakes';
import { makeFakeInspirationPayload } from 'src/entities/inspiration/inspiration-fakes';
import { makeFakeScorePayload } from 'src/entities/score/score-fakes';
import {
  makeFakeDiscussionCreateDTO,
  makeFakeDiscussionEditDTO,
  makeFakeDiscussionPayload,
} from 'src/entities/discussion/discussion-fakes';
import faker from 'test/faker';
import { getUniqueInsoCode } from 'src/modules/shared/generateInsoCode';
import DISCUSSION_ERRORS from '../discussion-errors';

jest.mock('src/modules/shared/generateInsoCode');

describe('DiscussionController', () => {
  let appController: DiscussionController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let discussionModel: Model<any>;
  let userModel: Model<any>;
  let settingModel: Model<any>;
  let scoreModel: Model<any>;
  let inspirationModel: Model<any>;
  let calendarModel: Model<any>;
  let postModel: Model<any>;
  let reactionModel: Model<any>;
  let gradeModel: Model<any>;
  let user: HydratedDocument<User>;
  let calendar: HydratedDocument<Calendar>;
  let inspiration: HydratedDocument<Inspiration>;
  let score: HydratedDocument<Score>;
  let setting: HydratedDocument<Setting>;
  let discussionA: HydratedDocument<Discussion>;
  let discussionB: HydratedDocument<Discussion>;
  let mockRequest: any;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    discussionModel = mongoConnection.model(Discussion.name, DiscussionSchema);
    settingModel = mongoConnection.model(Setting.name, SettingSchema);
    scoreModel = mongoConnection.model(Score.name, ScoreSchema);

    inspirationModel = mongoConnection.model(
      Inspiration.name,
      InspirationSchema,
    );
    userModel = mongoConnection.model(User.name, UserSchema);
    calendarModel = mongoConnection.model(Calendar.name, CalendarSchema);
    postModel = mongoConnection.model(
      DiscussionPost.name,
      DiscussionPostSchema,
    );

    reactionModel = mongoConnection.model(Reaction.name, ReactionSchema);
    gradeModel = mongoConnection.model(Grade.name, GradeSchema);
  });

  const mockMilestoneService = {
    getMilestoneForUser: jest.fn(),
    createMilestoneForUser: jest.fn(),
  };

  beforeEach(async () => {
    user = await userModel.create(makeFakeUserPayload());
    calendar = await calendarModel.create(makeFakeCalendarPayload());
    inspiration = await inspirationModel.create(makeFakeInspirationPayload());
    score = await scoreModel.create(makeFakeScorePayload());
    mockRequest = {
      user: {
        userId: user._id,
        username: user.username,
      },
    };
    setting = await settingModel.create(
      makeFakeSettingPayload({
        userId: user._id,
        calendar: calendar._id,
        post_inspirations: [inspiration._id],
        score: score._id,
      }),
    );
    discussionA = await discussionModel.create(
      makeFakeDiscussionPayload({
        archived: null,
        settings: setting._id,
        poster: user._id,
        participants: [
          {
            user: user._id,
            joined: faker.date.past(),
            muted: faker.datatype.boolean(),
            grade: faker.database.fakeMongoId(),
          },
        ],
      }),
    );

    discussionB = await discussionModel.create(
      makeFakeDiscussionPayload({
        poster: user._id,
        archived: null,
        settings: setting._id,
      }),
    );

    const app: TestingModule = await Test.createTestingModule({
      controllers: [DiscussionController],
      providers: [
        { provide: getModelToken(Discussion.name), useValue: discussionModel },
        { provide: getModelToken(Setting.name), useValue: settingModel },
        { provide: getModelToken(Score.name), useValue: scoreModel },
        {
          provide: getModelToken(Inspiration.name),
          useValue: inspirationModel,
        },
        { provide: getModelToken(User.name), useValue: userModel },
        { provide: getModelToken(Calendar.name), useValue: calendarModel },
        { provide: getModelToken(DiscussionPost.name), useValue: postModel },
        { provide: getModelToken(Reaction.name), useValue: reactionModel },
        { provide: getModelToken(Grade.name), useValue: gradeModel },
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

    appController = app.get<DiscussionController>(DiscussionController);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await discussionModel.deleteMany({});
    await settingModel.deleteMany({});
    await scoreModel.deleteMany({});
    await inspirationModel.deleteMany({});
    await userModel.deleteMany({});
    await calendarModel.deleteMany({});
    await postModel.deleteMany({});
    await reactionModel.deleteMany({});
    await gradeModel.deleteMany({});
  });

  describe('createDiscussion (POST /discussion)', () => {
    describe('200 OK', () => {
      it('should create discussion with unique new insoID', async () => {
        const discussionDTO = makeFakeDiscussionCreateDTO({
          poster: user._id,
          facilitators: [user._id],
        });
        const result = await appController.createDiscussion(
          discussionDTO,
          mockRequest,
        );
        expect(result).toMatchObject(discussionDTO);
        expect(getUniqueInsoCode).toHaveBeenCalled();
      });

      it('should create a discussion and discussion setting with all existing inspirations', async () => {
        const discussionDTO = makeFakeDiscussionCreateDTO({
          poster: user._id,
          facilitators: [user._id],
        });
        const result = await appController.createDiscussion(
          discussionDTO,
          mockRequest,
        );
        const newSettings = await settingModel.findById(result.settings);
        expect(newSettings.post_inspirations).toHaveLength(1);
        expect(newSettings.post_inspirations[0]).toEqual(inspiration._id);

        const newInspiration = await inspirationModel.create(
          makeFakeInspirationPayload(),
        );
        const result2 = await appController.createDiscussion(
          discussionDTO,
          mockRequest,
        );
        const newSettings2 = await settingModel.findById(result2.settings);
        expect(newSettings2.post_inspirations).toHaveLength(2);
        expect(newSettings2.post_inspirations[0]).toEqual(inspiration._id);
        expect(newSettings2.post_inspirations[1]).toEqual(newInspiration._id);
      });

      it('should create milestone for Discussion Created if it does not exist for user', async () => {
        const discussionDTO = makeFakeDiscussionCreateDTO({
          poster: user._id,
          facilitators: [user._id],
        });
        const result = await appController.createDiscussion(
          discussionDTO,
          mockRequest,
        );
        expect(result).toMatchObject(discussionDTO);
        expect(mockMilestoneService.getMilestoneForUser).toHaveBeenCalledWith(
          user._id,
          'Discussion Created',
        );
        expect(
          mockMilestoneService.createMilestoneForUser,
        ).toHaveBeenCalledWith(user._id, 'discussion', 'Discussion Created', {
          discussionId: result._id,
          postId: null,
          date: expect.any(Date),
        });
      });

      it('should not create milestone for Discussion Created if it does exist for user', async () => {
        const discussionDTO = makeFakeDiscussionCreateDTO({
          poster: user._id,
          facilitators: [user._id],
        });
        mockMilestoneService.getMilestoneForUser.mockResolvedValueOnce(
          "I'm a milestone",
        );
        const result = await appController.createDiscussion(
          discussionDTO,
          mockRequest,
        );
        expect(result).toMatchObject(discussionDTO);
        expect(mockMilestoneService.getMilestoneForUser).toHaveBeenCalledWith(
          user._id,
          'Discussion Created',
        );
        expect(
          mockMilestoneService.createMilestoneForUser,
        ).toHaveBeenCalledTimes(0);
      });

      it('should create and return a valid discussion', async () => {
        const discussionDTO = makeFakeDiscussionCreateDTO({
          poster: user._id,
          facilitators: [user._id],
        });

        const result = await appController.createDiscussion(
          discussionDTO,
          mockRequest,
        );
        expect(result).toMatchObject(discussionDTO);
      });
    });

    describe('404 Errors', () => {
      it('poster not found', () => {
        const discussionDTO = makeFakeDiscussionCreateDTO({
          poster: faker.database.fakeMongoId(),
          facilitators: [user._id],
        });

        return expect(
          appController.createDiscussion(discussionDTO, mockRequest),
        ).rejects.toThrow(DISCUSSION_ERRORS.USER_NOT_FOUND);
      });

      it('facilitator not found', () => {
        const validDiscussion = {
          name: 'Power',
          poster: user._id,
          facilitators: [new Types.ObjectId()],
        };

        return expect(
          appController.createDiscussion(validDiscussion, mockRequest),
        ).rejects.toThrow(DISCUSSION_ERRORS.FACILITATOR_NOT_FOUND);
      });
    });

    describe('400 Errors', () => {
      it('request user not matching poster', async () => {
        const user2 = await userModel.create(makeFakeUserPayload());
        const discussionDTO = makeFakeDiscussionCreateDTO({
          poster: user2,
          facilitators: [user._id],
        });

        return expect(
          appController.createDiscussion(discussionDTO, mockRequest),
        ).rejects.toThrow(DISCUSSION_ERRORS.DISCUSSION_POSTER_MISMATCH);
      });
    });
  });

  describe('updateDiscussionMetadata (PATCH discussion/:discussionId/metadata)', () => {
    describe('200 OK', () => {
      it('should update discussion metadata and return updated discussion', async () => {
        const discussionEditDTO = makeFakeDiscussionEditDTO({
          facilitators: [user._id],
          participants: undefined,
        });
        const result = await appController.updateDiscussionMetadata(
          discussionA._id.toString(),
          discussionEditDTO,
        );
        expect(result.facilitators).toMatchObject(
          discussionEditDTO.facilitators,
        );
        expect(result.participants).toMatchObject(discussionA.participants);
      });
    });

    describe('404 Errors', () => {
      it('discussion not found', async () => {
        const discussionEditDTO = makeFakeDiscussionEditDTO({
          facilitators: [user._id],
          participants: undefined,
        });
        return expect(
          appController.updateDiscussionMetadata(
            faker.database.mongodbObjectId(),
            discussionEditDTO,
          ),
        ).rejects.toThrow(DISCUSSION_ERRORS.DISCUSSION_NOT_FOUND);
      });

      it('facilitator user not found', async () => {
        const discussionEditDTO = makeFakeDiscussionEditDTO({
          facilitators: [faker.database.fakeMongoId()],
          participants: undefined,
        });
        return expect(
          appController.updateDiscussionMetadata(
            discussionA._id.toString(),
            discussionEditDTO,
          ),
        ).rejects.toThrow(DISCUSSION_ERRORS.FACILITATOR_NOT_FOUND);
      });
    });

    describe('400 Errors', () => {
      it('adding participant', async () => {
        const discussionEditDTO = makeFakeDiscussionEditDTO({
          facilitators: [user._id],
          participants: [user._id],
        });
        return expect(
          appController.updateDiscussionMetadata(
            discussionA._id.toString(),
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
        const result = await appController.getDiscussion(
          discussionA._id.toString(),
        );

        expect(result).toMatchObject({
          archived: discussionA.archived,
          created: discussionA.created,
          insoCode: discussionA.insoCode,
          keywords: discussionA.keywords,
          name: discussionA.name,
          participants: [
            {
              f_name: user.f_name,
              l_name: user.l_name,
              username: user.username,
            },
          ],
          poster: {
            f_name: user.f_name,
            l_name: user.l_name,
            username: user.username,
          },
          posts: [],
          settings: {
            calendar: {
              close: calendar.close.toString(),
              open: calendar.open.toString(),
            },
            // post_inspiration: setting.post_inspirations,
            scores: {
              active_days: {
                max_points: score.active_days.max_points,
                required: score.active_days.required,
              },
              comments_received: {
                max_points: score.comments_received.max_points,
                required: score.comments_received.required,
              },
              criteria: [
                {
                  criteria: score.criteria[0].criteria,
                  max_points: score.criteria[0].max_points,
                },
              ],
              post_inspirations: {
                max_points: score.post_inspirations.max_points,
                selected: score.post_inspirations.selected,
              },

              posts_made: {
                max_points: score.posts_made.max_points,
                required: score.posts_made.required,
              },
            },
            starter_prompt: setting.starter_prompt,
          },
        });
      });
    });

    describe('404 Errors', () => {
      it('discussion not found', async () => {
        return expect(
          appController.getDiscussion(faker.database.mongodbObjectId()),
        ).rejects.toThrow(DISCUSSION_ERRORS.DISCUSSION_NOT_FOUND);
      });
    });

    describe('400 Errors', () => {
      it('discussion id invalid', async () => {
        return expect(appController.getDiscussion('invalid')).rejects.toThrow(
          DISCUSSION_ERRORS.DISCUSSION_ID_INVALID,
        );
      });
    });
  });

  describe('archiveDiscussion (POST discussion/:discussionId/archive)', () => {
    describe('200 OK', () => {
      it('should archive discussion', async () => {
        const result = await appController.archiveDiscussion(
          discussionA._id.toString(),
        );
        expect(result).toMatchObject({ archived: expect.any(Date) });
      });
    });

    describe('400 Errors', () => {
      it('discussion id invalid', async () => {
        return expect(
          appController.archiveDiscussion('invalid'),
        ).rejects.toThrow(DISCUSSION_ERRORS.DISCUSSION_ID_INVALID);
      });
    });
  });

  describe('duplicateDiscussion (POST discussion/:discussionId/duplicate)', () => {
    describe('200 OK', () => {
      it('should duplicate discussion', async () => {
        const result = await appController.duplicateDiscussion(
          discussionA._id.toString(),
        );
        expect(result).toMatchObject({
          name: discussionA.name,
          facilitators: discussionA.facilitators,
          settings: discussionA.settings,
          poster: discussionA.poster,
        });
        expect(getUniqueInsoCode).toBeCalledTimes(1);
      });
    });

    describe('404 Errors', () => {
      it('discussion not found', async () => {
        return expect(
          appController.duplicateDiscussion(faker.database.mongodbObjectId()),
        ).rejects.toThrow(DISCUSSION_ERRORS.DISCUSSION_NOT_FOUND);
      });
    });

    describe('400 Errors', () => {
      it('discussion id invalid', async () => {
        return expect(
          appController.duplicateDiscussion('invalid'),
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
          appController.getDiscussions(
            faker.database.mongodbObjectId(),
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
          appController.getDiscussions(
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
        const user2 = await userModel.create(makeFakeUserPayload());
        return expect(
          appController.getDiscussions(
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
          score: score._id,
          calendar: calendar._id,
          post_inspirations: [inspiration._id],
        });
        return expect(
          appController.updateDiscussionSettings(
            settingsCreateDTO,
            discussionA._id.toString(),
          ),
        ).resolves.not.toThrow();
      });
    });

    describe('404 Errors', () => {
      it('discussion not found', async () => {
        const settingsCreateDTO = makeFakeSettingsCreateDTO();
        const nonExistantDiscussionId = faker.database.mongodbObjectId();

        return expect(
          appController.updateDiscussionSettings(
            settingsCreateDTO,
            nonExistantDiscussionId,
          ),
        ).rejects.toThrow(DISCUSSION_ERRORS.DISCUSSION_NOT_FOUND);
      });

      it('post inspiration not found', async () => {
        const settingsCreateDTO = makeFakeSettingsCreateDTO({
          ...setting.toObject(),
          post_inspirations: [faker.database.fakeMongoId()],
        });

        return expect(
          appController.updateDiscussionSettings(
            settingsCreateDTO,
            discussionA._id.toString(),
          ),
        ).rejects.toThrow(DISCUSSION_ERRORS.POST_INSPIRATION_NOT_FOUND);
      });

      it('calander not found', async () => {
        const settingsCreateDTO = makeFakeSettingsCreateDTO({
          ...setting.toObject(),
          calendar: faker.database.fakeMongoId(),
        });

        return expect(
          appController.updateDiscussionSettings(
            settingsCreateDTO,
            discussionA._id.toString(),
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
        const results = await appController.joinDiscussion(
          user._id.toString(),
          discussionB.insoCode,
        );

        expect(results.participants).toContainEqual({
          user: user._id,
          joined: expect.any(Date),
          muted: false,
          grade: null,
        });
      });
    });

    describe('409 Errors', () => {
      it('user already in discussion', async () => {
        await expect(
          appController.joinDiscussion(
            user._id.toString(),
            discussionA.insoCode,
          ),
        ).rejects.toThrowError(DISCUSSION_ERRORS.USER_ALREADY_IN_DISCUSSION);
      });
    });
    describe('404 Errors', () => {
      it('discussion not found', async () => {
        await expect(
          appController.joinDiscussion(
            user._id.toString(),
            faker.datatype.string(5),
          ),
        ).rejects.toThrowError(DISCUSSION_ERRORS.DISCUSSION_NOT_FOUND);
      });

      it('user not found', async () => {
        await expect(
          appController.joinDiscussion(
            faker.database.mongodbObjectId(),
            discussionA.insoCode,
          ),
        ).rejects.toThrowError(DISCUSSION_ERRORS.USER_NOT_FOUND);
      });
    });

    describe('400 Errors', () => {
      it('insoCode is invalid', async () => {
        await expect(
          appController.joinDiscussion(
            user._id.toString(),
            faker.datatype.string(6),
          ),
        ).rejects.toThrowError(DISCUSSION_ERRORS.INSO_CODE_INVALID);
      });

      it('user id invalid', async () => {
        await expect(
          appController.joinDiscussion(
            faker.datatype.string(6),
            discussionA.insoCode,
          ),
        ).rejects.toThrowError(DISCUSSION_ERRORS.USER_ID_INVALID);
      });
    });
  });

  describe('removeParticipant (PATCH discussions/:discussionId/participants/:participantId/remove)', () => {
    describe('200 OK', () => {
      it('should remove participant', async () => {
        const results = await appController.removeParticipant(
          discussionA._id.toString(),
          user._id.toString(),
        );

        expect(results.participants).not.toContainEqual({
          user: user._id,
          joined: expect.any(Date),
          muted: false,
          grade: null,
        });
      });
    });

    describe('400 Errors', () => {
      it('participant not memeber', async () => {
        await expect(
          appController.removeParticipant(
            discussionA._id.toString(),
            faker.database.mongodbObjectId(),
          ),
        ).rejects.toThrowError(DISCUSSION_ERRORS.PARTICIPANT_NOT_IN_DISUCSSION);
      });
    });
  });

  describe('addTag (POST discussions/:discussionId/tags)', () => {
    describe('200 OK', () => {
      it('should add tag', async () => {
        const tag = faker.datatype.string();
        const results = await appController.addTag(
          discussionA._id.toString(),
          tag,
        );

        expect(results.tags).toContainEqual(tag);
      });
    });

    describe('404 Errors', () => {
      it('discussion does not exist', async () => {
        await expect(
          appController.addTag(
            faker.database.mongodbObjectId(),
            faker.datatype.string(),
          ),
        ).rejects.toThrowError(DISCUSSION_ERRORS.DISCUSSION_NOT_FOUND);
      });
    });

    describe('400 Errors', () => {
      it('tag already exists', async () => {
        await expect(
          appController.addTag(discussionA._id.toString(), discussionA.tags[0]),
        ).rejects.toThrowError(DISCUSSION_ERRORS.DUPLICATE_TAG);
      });
    });
  });

  describe('muteUserInDiscussion (PATCH users/:userId/discussions/:discussionId/mute)', () => {
    describe('200 OK', () => {
      it('should mute user', async () => {
        return expect(
          appController.muteUserInDiscussion(
            user._id.toString(),
            discussionA._id.toString(),
          ),
        ).resolves.not.toThrow();
      });
    });

    describe('404 Errors', () => {
      it('discussion does not exist', async () => {
        await expect(
          appController.muteUserInDiscussion(
            user._id.toString(),
            faker.database.mongodbObjectId(),
          ),
        ).rejects.toThrowError(DISCUSSION_ERRORS.DISCUSSION_NOT_FOUND);
      });
      it('user not in discussion', async () => {
        await expect(
          appController.muteUserInDiscussion(
            faker.database.mongodbObjectId(),
            discussionA._id.toString(),
          ),
        ).rejects.toThrowError(DISCUSSION_ERRORS.USER_NOT_FOUND);
      });
    });
  });

  describe('400 Errors', () => {
    it('user id invalid', async () => {
      await expect(
        appController.muteUserInDiscussion(
          faker.datatype.string(6),
          discussionA._id.toString(),
        ),
      ).rejects.toThrowError(DISCUSSION_ERRORS.USER_ID_INVALID);
    });

    it('discussion id invalid', async () => {
      await expect(
        appController.muteUserInDiscussion(
          user._id.toString(),
          faker.datatype.string(6),
        ),
      ).rejects.toThrowError(DISCUSSION_ERRORS.DISCUSSION_ID_INVALID);
    });
  });

  describe('deleteDiscussion (DELETE discussion/:discussionId)', () => {
    describe('200 OK', () => {
      it('should delete discussion', async () => {
        return expect(
          appController.deleteDiscussion(discussionA._id.toString()),
        ).resolves.not.toThrow();
      });
    });

    describe('409 Errors', () => {
      it('discussion has posts', async () => {
        await postModel.create({
          discussionId: discussionA._id,
        });
        await expect(
          appController.deleteDiscussion(discussionA._id.toString()),
        ).rejects.toThrowError(DISCUSSION_ERRORS.DISCUSSION_HAS_POSTS);
      });
    });
  });

  afterAll((done) => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoConnection.close();
    done();
  });
});
