import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Score } from 'src/entities/score/score';
import { User } from 'src/entities/user/user';
import { TestingDatabase, testingDatabase, FakeDocuments } from 'test/database';
import { ScoreController } from './score.controller';
import SCORE_ERRORS from './score-errors';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequesterIsUserGuard } from 'src/auth/guards/userGuards/requesterIsUser.guard';
import { IsScoreCreatorGuard } from 'src/auth/guards/userGuards/isScoreCreator.guard';

import faker from 'test/faker';
import {
  makeFakeCreateGradingCriteria,
  // makeFakeCreateAutoRequirements,
  // makeFakeCreateGradingCriteria,
  // makeFakeCreatePostInspirationOptions,
  makeFakeScoreCreateDTO,
  makeFakeScoreEditDTO,
} from 'src/entities/score/score-fakes';

describe('ScoreController', () => {
  let database: TestingDatabase;
  let checkScore: any;
  let fakeDocuments: FakeDocuments;
  let module: TestingModule;

  beforeAll(async () => {
    database = await testingDatabase();
  });

  let scoreController: ScoreController;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [ScoreController],
      providers: [
        {
          provide: getModelToken(Score.name),
          useValue: database.score,
        },
        {
          provide: getModelToken(User.name),
          useValue: database.user,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: () => true,
      })
      .overrideGuard(RequesterIsUserGuard)
      .useValue({
        canActivate: () => true,
      })
      .overrideGuard(IsScoreCreatorGuard)
      .useValue({
        canActivate: () => true,
      })
      .compile();
    scoreController = module.get<ScoreController>(ScoreController);
  });

  beforeEach(async () => {
    fakeDocuments = await database.createFakes();
    checkScore = scoreController.checkScore;
  });

  afterEach(async () => {
    jest.clearAllMocks();
    scoreController.checkScore = checkScore;
    await database.clearDatabase();
  });

  describe('createScore (POST users/:userId/score)', () => {
    describe('200 OK', () => {
      it('should create score', async () => {
        const scoreDTO = makeFakeScoreCreateDTO();
        jest.spyOn(database.score, 'create');
        scoreController.checkScore = jest.fn().mockResolvedValue(true);
        const createdScore = await scoreController.createScore(
          fakeDocuments.user._id.toString(),
          scoreDTO,
        );

        expect(database.score.create).toHaveBeenCalledWith({
          ...scoreDTO,
          creatorId: fakeDocuments.user._id,
        });
        expect(scoreController.checkScore).toHaveBeenCalledWith(scoreDTO);
        expect(createdScore).toBeDefined();
      });
    });

    describe('400 BAD REQUEST', () => {
      it('should throw an error if the user id is invalid', async () => {
        expect.assertions(3);
        const scoreDTO = makeFakeScoreCreateDTO();
        await expect(
          scoreController.createScore('invalid', scoreDTO),
        ).rejects.toThrow(SCORE_ERRORS.USER_ID_INVALID);

        await expect(
          scoreController.createScore(null, scoreDTO),
        ).rejects.toThrow(SCORE_ERRORS.USER_ID_INVALID);

        await expect(
          scoreController.createScore(undefined, scoreDTO),
        ).rejects.toThrow(SCORE_ERRORS.USER_ID_INVALID);
      });
    });

    describe('404 NOT FOUND', () => {
      it('should throw an error if the user is not found', async () => {
        const scoreDTO = makeFakeScoreCreateDTO();

        expect.assertions(1);
        await expect(
          scoreController.createScore(
            faker.database.mongoObjectIdString(),
            scoreDTO,
          ),
        ).rejects.toThrow(SCORE_ERRORS.USER_NOT_FOUND);
      });
    });
  });

  describe('updateScore (PATCH users/:userId/score/:scoreId)', () => {
    describe('200 OK', () => {
      it('should update score', async () => {
        const scoreEditDTO = makeFakeScoreEditDTO();
        jest.spyOn(database.score, 'findOneAndUpdate');
        scoreController.checkScore = jest.fn().mockResolvedValue(true);
        const updatedScore = await scoreController.updateScore(
          fakeDocuments.user._id.toString(),
          fakeDocuments.score._id.toString(),
          scoreEditDTO,
        );

        expect(database.score.findOneAndUpdate).toHaveBeenCalledWith(
          { _id: fakeDocuments.score._id },
          scoreEditDTO,
        );
        expect(scoreController.checkScore).toHaveBeenCalledWith({
          ...fakeDocuments.score.toObject(),
          ...scoreEditDTO,
        });
        expect(updatedScore).toBeDefined();
      });
    });

    describe('400 BAD REQUEST', () => {
      it('should throw an error if the score id is empty', async () => {
        await expect(
          scoreController.updateScore(
            faker.database.mongoObjectIdString(),
            faker.database.mongoObjectIdString(),
            null,
          ),
        ).rejects.toThrow(SCORE_ERRORS.SCORE_EMPTY);
      });

      it('should throw an error if the userId is invalid', async () => {
        const scoreEditDTO = makeFakeScoreEditDTO();
        expect.assertions(3);
        await expect(
          scoreController.updateScore(
            'invalid',
            faker.database.mongoObjectIdString(),
            scoreEditDTO,
          ),
        ).rejects.toThrow(SCORE_ERRORS.USER_ID_INVALID);

        await expect(
          scoreController.updateScore(
            null,
            faker.database.mongoObjectIdString(),
            scoreEditDTO,
          ),
        ).rejects.toThrow(SCORE_ERRORS.USER_ID_INVALID);

        await expect(
          scoreController.updateScore(
            undefined,
            faker.database.mongoObjectIdString(),
            scoreEditDTO,
          ),
        ).rejects.toThrow(SCORE_ERRORS.USER_ID_INVALID);
      });

      it('should throw an error if the scoreId is not valid', async () => {
        const scoreEditDTO = makeFakeScoreEditDTO();
        expect.assertions(3);
        await expect(
          scoreController.updateScore(
            fakeDocuments.user._id.toString(),
            'invalid',
            scoreEditDTO,
          ),
        ).rejects.toThrow(SCORE_ERRORS.SCORE_ID_INVALID);

        await expect(
          scoreController.updateScore(
            fakeDocuments.user._id.toString(),
            null,
            scoreEditDTO,
          ),
        ).rejects.toThrow(SCORE_ERRORS.SCORE_ID_INVALID);

        await expect(
          scoreController.updateScore(
            fakeDocuments.user._id.toString(),
            undefined,
            scoreEditDTO,
          ),
        ).rejects.toThrow(SCORE_ERRORS.SCORE_ID_INVALID);
      });
    });

    describe('404 NOT FOUND', () => {
      it('should throw an error if the user is not found', async () => {
        const scoreEditDTO = makeFakeScoreEditDTO();
        expect.assertions(1);
        await expect(
          scoreController.updateScore(
            faker.database.mongoObjectIdString(),
            faker.database.mongoObjectIdString(),
            scoreEditDTO,
          ),
        ).rejects.toThrow(SCORE_ERRORS.USER_NOT_FOUND);
      });

      it('should throw an error if the score is not found', async () => {
        const scoreEditDTO = makeFakeScoreEditDTO();
        expect.assertions(1);
        await expect(
          scoreController.updateScore(
            fakeDocuments.user._id.toString(),
            faker.database.mongoObjectIdString(),
            scoreEditDTO,
          ),
        ).rejects.toThrow(SCORE_ERRORS.SCORE_NOT_FOUND);
      });
    });
  });

  describe('checkScore', () => {
    describe('failures', () => {
      it('should throw an error if auto score totals do not add up', () => {
        const autoScore = makeFakeScoreCreateDTO({
          type: 'auto',
          total: 100,
        });

        expect(() => scoreController.checkScore(autoScore)).toThrow(
          SCORE_ERRORS.SCORE_TOTAL_INVALID,
        );
      });

      it('should throw an error if ruberic score total do not add up', () => {
        const rubericScore = makeFakeScoreCreateDTO({
          type: 'rubric',
          total: 100,
        });
        expect(() => scoreController.checkScore(rubericScore)).toThrow(
          SCORE_ERRORS.SCORE_TOTAL_INVALID,
        );
      });
    });

    describe('success', () => {
      it('should return true if auto score is valid', () => {
        const autoScore = makeFakeScoreCreateDTO({
          type: 'auto',
          total: 100,
          active_days: {
            max_points: 25,
            required: faker.datatype.number(),
          },
          comments_received: {
            max_points: 25,
            required: faker.datatype.number(),
          },
          post_inspirations: {
            max_points: 25,
            selected: faker.datatype.boolean(),
          },
          posts_made: {
            max_points: 25,
            required: faker.datatype.number(),
          },
        });

        expect(() => scoreController.checkScore(autoScore)).not.toThrow();
      });

      it('should return true if auto score is valid with no active_days', () => {
        const autoScore = makeFakeScoreCreateDTO({
          type: 'auto',
          total: 100,
          active_days: undefined,
          comments_received: {
            max_points: 25,
            required: faker.datatype.number(),
          },
          post_inspirations: {
            max_points: 25,
            selected: faker.datatype.boolean(),
          },
          posts_made: {
            max_points: 50,
            required: faker.datatype.number(),
          },
        });

        expect(() => scoreController.checkScore(autoScore)).not.toThrow();
      });

      it('should return true if auto score is valid with no comments_received', () => {
        const autoScore = makeFakeScoreCreateDTO({
          type: 'auto',
          total: 100,
          active_days: {
            max_points: 25,
            required: faker.datatype.number(),
          },
          comments_received: undefined,
          post_inspirations: {
            max_points: 25,
            selected: faker.datatype.boolean(),
          },
          posts_made: {
            max_points: 50,
            required: faker.datatype.number(),
          },
        });
        // Jest coverage is lying about line 124. It is being hit. :shrug:
        expect(() => scoreController.checkScore(autoScore)).not.toThrow();
      });

      it('should return true if auto score is valid with no post_inspirations', () => {
        const autoScore = makeFakeScoreCreateDTO({
          type: 'auto',
          total: 100,
          active_days: {
            max_points: 25,
            required: faker.datatype.number(),
          },
          comments_received: {
            max_points: 25,
            required: faker.datatype.number(),
          },
          post_inspirations: undefined,
          posts_made: {
            max_points: 50,
            required: faker.datatype.number(),
          },
        });

        expect(() => scoreController.checkScore(autoScore)).not.toThrow();
      });

      it('should return true if auto score is valid with no posts_made', () => {
        const autoScore = makeFakeScoreCreateDTO({
          type: 'auto',
          total: 100,
          active_days: {
            max_points: 25,
            required: faker.datatype.number(),
          },
          comments_received: {
            max_points: 25,
            required: faker.datatype.number(),
          },
          post_inspirations: {
            max_points: 50,
            selected: faker.datatype.boolean(),
          },
          posts_made: undefined,
        });

        expect(() => scoreController.checkScore(autoScore)).not.toThrow();
      });

      it('should return true if ruberic score is valid', () => {
        const rubricScore = makeFakeScoreCreateDTO({
          type: 'rubric',
          total: 100,
          criteria: [
            makeFakeCreateGradingCriteria({ max_points: 25 }),
            makeFakeCreateGradingCriteria({ max_points: 25 }),
            makeFakeCreateGradingCriteria({ max_points: 25 }),
            makeFakeCreateGradingCriteria({ max_points: 25 }),
          ],
        });

        expect(() => scoreController.checkScore(rubricScore)).not.toThrow();
      });
    });
  });
});
