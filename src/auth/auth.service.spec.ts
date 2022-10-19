import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Discussion } from 'src/entities/discussion/discussion';
import { DiscussionPost } from 'src/entities/post/post';
import { Score } from 'src/entities/score/score';
import { User } from 'src/entities/user/user';
import { Reaction } from 'src/entities/reaction/reaction';
import { Calendar } from 'src/entities/calendar/calendar';
import * as bcrypt from 'bcrypt';
import { GoogleUserDTO } from '../entities/user/google-user';
import { validatePassword } from 'src/entities/user/commonFunctions/validatePassword';
import { UserReadDTO } from 'src/entities/user/read-user';
import AUTH_ERRORS from './auth-errors';
import { TestingDatabase, testingDatabase, FakeDocuments } from 'test/database';
import { makeFakeUserPayload } from 'src/entities/user/user-fakes';
import faker from 'test/faker';

jest.mock('bcrypt');
jest.mock('@nestjs/jwt');
jest.mock('../entities/user/google-user');
jest.mock('src/entities/user/commonFunctions/validatePassword');
jest.mock('src/entities/user/read-user');
const bcryptCompare = jest.spyOn(bcrypt, 'compare');
const bcryptHash = jest.spyOn(bcrypt, 'hash');
const jwtSign = jest.spyOn(JwtService.prototype, 'sign');

describe('AuthService', () => {
  let database: TestingDatabase;
  let fakeDocuments: FakeDocuments;
  let service: AuthService;
  let module: TestingModule;

  // mockJwtSign();
  // (() => ({
  //   options: {},
  //   logger: {},
  //   mergeJwtOptions: {},
  //   getSecretKey: {},

  //   sign: jest.fn(),
  //   signAsync: jest.fn(),
  //   verify: jest.fn(),
  //   verifyAsync: jest.fn(),
  //   decode: jest.fn(),
  // }));

  beforeAll(async () => {
    database = await testingDatabase();
  });

  beforeEach(async () => {
    fakeDocuments = await database.createFakes();
    module = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getModelToken(Discussion.name),
          useValue: database.discussion,
        },
        {
          provide: getModelToken(DiscussionPost.name),
          useValue: database.post,
        },
        { provide: getModelToken(Score.name), useValue: database.score },
        { provide: getModelToken(Calendar.name), useValue: database.calendar },
        { provide: getModelToken(User.name), useValue: database.user },
        { provide: getModelToken(Reaction.name), useValue: database.reaction },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  afterEach(async () => {
    await database.clearDatabase();
    jest.clearAllMocks();
  });

  test('it should instantiate', async () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should be defined', () => {
      expect(service.validateUser).toBeDefined();
    });

    it('should raise an error if user is not found', async () => {
      await expect(service.validateUser('test', 'test')).rejects.toEqual(
        AUTH_ERRORS.EMAIL_NOT_FOUND,
      );
    });

    it('should raise an error if user is found but has no password (SSO configured)', async () => {
      const mockUser = await database.user.create(
        makeFakeUserPayload({
          password: undefined,
        }),
      );

      await expect(
        service.validateUser(
          mockUser.contact[0].email,
          faker.datatype.string(),
        ),
      ).rejects.toEqual(AUTH_ERRORS.SSO_CONFIGURED);
    });

    it('should raise an error if the passwords to not match', async () => {
      bcryptCompare.mockImplementation(() => Promise.resolve(false));

      await expect(
        service.validateUser(
          fakeDocuments.user.contact[0].email,
          faker.datatype.string(),
        ),
      ).rejects.toEqual(AUTH_ERRORS.INVALID_PASSWORD);
    });

    it('should call login if user found and valid password', async () => {
      const oldLogin = service.login;
      service.login = jest.fn();
      bcryptCompare.mockImplementation(() => Promise.resolve(true));
      const password = faker.datatype.string();
      await service.validateUser(
        fakeDocuments.user.contact[0].email,
        password, // Mocked the hash check.
      );
      expect(service.login).toHaveBeenCalled();
      expect(bcrypt.compare).toHaveBeenCalledWith(
        password,
        fakeDocuments.user.password,
      );
      service.login = oldLogin;
    });
  });

  describe('login', () => {
    it('should be defined', () => {
      expect(service.login).toBeDefined();
    });

    it('should return a jwt token', async () => {
      jwtSign.mockImplementation(() => 'token');
      const token = await service.login(fakeDocuments.user);
      expect.assertions(2);
      expect(token).toBeDefined();
      expect(jwtSign).toHaveBeenCalledWith({
        username: fakeDocuments.user.username,
        sub: fakeDocuments.user._id,
      });
    });
  });

  describe('googleLogin', () => {
    it('should be defined', () => {
      expect(service.googleLogin).toBeDefined();
    });

    it('should raise exception if user is not on payload', async () => {
      const payload = {
        email: ' ',
      };
      await expect(service.googleLogin(payload)).rejects.toEqual(
        AUTH_ERRORS.USER_NOT_FOUND_GOOGLE,
      );
    });

    it('should look for user by email', async () => {
      jest.spyOn(database.user, 'findOne');
      const payload = {
        user: {
          email: fakeDocuments.user.contact[0].email,
        },
      };
      service.googleLogin(payload);
      expect(database.user.findOne).toHaveBeenCalledWith({
        'contact.email': fakeDocuments.user.contact[0].email,
      });
    });

    it('should sign jwt if user found by email', async () => {
      jest.spyOn(database.user, 'findOne');
      const payload = {
        user: {
          email: fakeDocuments.user.contact[0].email,
        },
      };
      jwtSign.mockImplementation(() => 'Googletoken');
      const token = await service.googleLogin(payload);
      expect(database.user.findOne).toHaveBeenCalledWith({
        'contact.email': fakeDocuments.user.contact[0].email,
      });
      expect(token).toEqual({
        access_token: 'Googletoken',
      });
    });

    it('should lookup username based on first and last name', async () => {
      const payload = {
        user: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john_doe@inso.com',
        },
      };

      await service.googleLogin(payload);
      expect(GoogleUserDTO).toHaveBeenCalledWith({
        f_name: 'John',
        l_name: 'Doe',
        username: 'JohnDoe1',
        contact: [
          {
            email: 'john_doe@inso.com',
            verified: false,
            primary: true,
          },
        ],
      });
    });

    it('should create unique new user name ', async () => {
      await new database.user({
        username: `JohnDoe`,
      }).save();
      for (let index = 0; index < 101; index++) {
        await new database.user({
          username: `JohnDoe${index}`,
        }).save();
      }

      const payload = {
        user: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john_doe@inso.com',
        },
      };

      const result = await service.googleLogin(payload);
      expect(GoogleUserDTO).toHaveBeenCalledWith({
        f_name: 'John',
        l_name: 'Doe',
        username: 'JohnDoe102',
        contact: [
          {
            email: 'john_doe@inso.com',
            verified: false,
            primary: true,
          },
        ],
      });
      expect(result).toEqual(undefined);
    });
  });

  describe('resetPassword', () => {
    it('should be defined', () => {
      expect(service.resetPassword).toBeDefined();
    });

    it('should raise an exception if passwords do not match', async () => {
      bcryptCompare.mockImplementation(() => Promise.resolve(false));
      await expect(
        service.resetPassword(
          fakeDocuments.user._id.toString(),
          faker.datatype.string(),
          faker.datatype.string(),
        ),
      ).rejects.toEqual(
        new HttpException(
          'Invalid credentials, old password is not correct',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should validate passowrd if passwords match', async () => {
      bcryptCompare.mockImplementation(() => Promise.resolve(true));
      await service.resetPassword(
        fakeDocuments.user._id.toString(),
        'oldPass',
        'newPass',
      );
      expect(validatePassword).toHaveBeenCalledWith('newPass');
    });

    it('should update passowrd if passwords match', async () => {
      jest.spyOn(database.user, 'findOneAndUpdate');

      bcryptCompare.mockImplementation(() => Promise.resolve(true));
      bcryptHash.mockImplementation(() => Promise.resolve('newPassHash'));

      await service.resetPassword(
        fakeDocuments.user._id.toString(),
        'oldPass',
        'newPass',
      );

      expect(database.user.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: fakeDocuments.user._id },
        { password: 'newPassHash' },
      );
    });
  });

  describe('resetPasswordFromEmail', () => {
    it('should be defined', () => {
      expect(service.resetPasswordFromEmail).toBeDefined();
    });

    it('should verify mongoIds', async () => {
      jest.spyOn(service, 'verifyMongoIds');
      await service.resetPasswordFromEmail(
        fakeDocuments.user._id.toString(),
        'asdf',
      );
      expect(service.verifyMongoIds).toHaveBeenCalledWith([
        fakeDocuments.user._id.toString(),
      ]);
    });

    it('should validate passowrd', async () => {
      await service.resetPasswordFromEmail(
        fakeDocuments.user._id.toString(),
        'asdf',
      );
      expect(validatePassword).toHaveBeenCalledWith('asdf');
    });

    it('should set new passowrd', async () => {
      bcryptHash.mockImplementation(() => Promise.resolve('newPassHash'));
      jest.spyOn(database.user, 'findOneAndUpdate');
      await service.resetPasswordFromEmail(
        fakeDocuments.user._id.toString(),
        'asdf',
      );
      expect(database.user.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: fakeDocuments.user._id },
        { password: 'newPassHash' },
      );
    });
  });

  describe('fetchUserAndStats', () => {
    it('should be defined', () => {
      expect(service.fetchUserAndStats).toBeDefined();
    });

    it('should fetch discussions for user', async () => {
      jest.spyOn(database.discussion, 'find');
      await service.fetchUserAndStats(fakeDocuments.user._id.toString());
      expect(database.discussion.find).toHaveBeenCalledWith({
        poster: fakeDocuments.user._id,
      });
    });

    it('should fetch discussions joined for the user', async () => {
      jest.spyOn(database.discussion, 'find');
      await service.fetchUserAndStats(fakeDocuments.user._id.toString());
      expect(database.discussion.find).toHaveBeenCalledWith({
        'participants.user': fakeDocuments.user._id,
      });
    });

    it('should fetch posts created for the user', async () => {
      jest.spyOn(database.post, 'find');
      await service.fetchUserAndStats(fakeDocuments.user._id.toString());
      expect(database.post.find).toHaveBeenCalledWith({
        userId: fakeDocuments.user._id,
      });
    });

    it('should fetch comments recieved for user posts', async () => {
      jest.spyOn(database.post, 'find');
      await service.fetchUserAndStats(fakeDocuments.user._id.toString());
      expect(database.post.find).toHaveBeenCalledWith({
        comment_for: { $in: [fakeDocuments.post._id] },
      });
    });

    it('should fetch upvotes for user', async () => {
      jest.spyOn(database.reaction, 'find');
      await service.fetchUserAndStats(fakeDocuments.user._id.toString());
      expect(database.reaction.find).toHaveBeenCalledWith({
        postId: { $in: [fakeDocuments.post._id] },
        reaction: '+1',
      });
    });

    it('should return UserReadDTO', async () => {
      const result = await service.fetchUserAndStats(
        fakeDocuments.user._id.toString(),
      );
      expect(UserReadDTO).toHaveBeenCalledWith({
        ...fakeDocuments.user.toObject(),
        statistics: {
          discussions_created: 1,
          discussions_joined: 1,
          posts_made: 1,
          comments_received: 0,
          upvotes: 0,
        },
      });
      expect(result).toEqual({});
    });

    it('should return UserReadDTO populated with stats', async () => {
      const user = await new database.user({
        _id: '5e9f1b9b9b9b9b9b9b9b9b9b',
      }).save();
      await new database.discussion({
        poster: user._id,
      }).save();
      await new database.discussion({
        poster: user._id,
      }).save();

      await new database.discussion({
        participants: {
          user: user._id,
        },
      }).save();
      await new database.discussion({
        participants: {
          user: user._id,
        },
      }).save();
      await new database.discussion({
        participants: {
          user: user._id,
        },
      }).save();

      await new database.post({
        userId: user._id,
      }).save();

      const post1 = await new database.post({
        userId: user._id,
      }).save();
      const post2 = await new database.post({
        userId: user._id,
      }).save();
      const post3 = await new database.post({
        userId: user._id,
      }).save();

      await new database.post({
        comment_for: [post1._id],
      }).save();
      await new database.post({
        comment_for: [post1._id],
      }).save();
      await new database.post({
        comment_for: [post2._id],
      }).save();
      await new database.post({
        comment_for: [post3._id],
      }).save();

      await new database.reaction({
        postId: post1._id,
        reaction: '+1',
      }).save();
      await new database.reaction({
        postId: post1._id,
        reaction: '+1',
      }).save();
      await new database.reaction({
        postId: post2._id,
        reaction: '+1',
      }).save();
      await new database.reaction({
        postId: post3._id,
        reaction: '+1',
      }).save();

      const result = await service.fetchUserAndStats(user._id.toString());
      expect(UserReadDTO).toHaveBeenCalledWith({
        ...user.toObject(),
        statistics: {
          discussions_created: 2,
          discussions_joined: 3,
          posts_made: 4,
          comments_received: 4,
          upvotes: 4,
        },
      });

      expect(result).toEqual({});
    });
  });

  describe('isDiscussionCreator', () => {
    it('should be defined', () => {
      expect(service.isDiscussionCreator).toBeDefined();
    });

    it('should raise exception if user is not discussion creator', async () => {
      const discussion = await new database.discussion({ poster: null }).save();
      await expect(
        service.isDiscussionCreator(
          fakeDocuments.user._id.toString(),
          discussion._id.toString(),
        ),
      ).rejects.toThrowError(AUTH_ERRORS.FORBIDDEN_FOR_USER);
    });

    it('should return true if user is discussion creator', async () => {
      const discussion = await new database.discussion({
        poster: fakeDocuments.user._id,
      }).save();
      await expect(
        service.isDiscussionCreator(
          fakeDocuments.user._id.toString(),
          discussion._id.toString(),
        ),
      ).resolves.toEqual(true);
    });
  });

  describe('isDiscussionFacilitator', () => {
    it('should be defined', () => {
      expect(service.isDiscussionFacilitator).toBeDefined();
    });

    it('should raise exception if user is not discussion Facilitator', async () => {
      const discussion = await new database.discussion({
        facilitators: [],
      }).save();

      expect.assertions(1);
      await expect(
        service.isDiscussionFacilitator(
          fakeDocuments.user._id.toString(),
          discussion._id.toString(),
        ),
      ).rejects.toThrowError(AUTH_ERRORS.FORBIDDEN_FOR_USER);
    });

    it('should return true if user is discussion Facilitator', async () => {
      const discussion = await new database.discussion({
        facilitators: [fakeDocuments.user._id],
      }).save();
      const result = await service.isDiscussionFacilitator(
        fakeDocuments.user._id.toString(),
        discussion._id.toString(),
      );
      expect(result).toEqual(true);
    });
  });

  describe('isDiscussionParticipant', () => {
    it('should be defined', () => {
      expect(service.isDiscussionParticipant).toBeDefined();
    });

    it('should raise exception if discussion is not found', async () => {
      await expect(
        service.isDiscussionParticipant(
          fakeDocuments.user._id.toString(),
          faker.database.mongoObjectIdString(),
        ),
      ).rejects.toThrowError(AUTH_ERRORS.DISCUSSION_NOT_FOUND);
    });

    it('should raise exception if user is not discussion Participant', async () => {
      const discussion = await new database.discussion({
        participants: [],
      }).save();
      await expect(
        service.isDiscussionParticipant(
          fakeDocuments.user._id.toString(),
          discussion._id.toString(),
        ),
      ).rejects.toThrowError(AUTH_ERRORS.FORBIDDEN_FOR_USER);
    });

    it('should return true if user is discussion Participant', async () => {
      const discussion = await new database.discussion({
        participants: [
          {
            user: fakeDocuments.user._id,
          },
        ],
      }).save();

      discussion.participants.push({
        user: fakeDocuments.user._id,
        joined: faker.date.past(),
        muted: faker.datatype.boolean(),
        grade: faker.database.mongoObjectId(),
      });

      await discussion.save();
      const result = await service.isDiscussionParticipant(
        fakeDocuments.user._id.toString(),
        discussion._id.toString(),
      );
      expect(result).toEqual(true);
    });
  });

  describe('isPostCreator', () => {
    it('should be defined', () => {
      expect(service.isPostCreator).toBeDefined();
    });

    it('should raise exception if user is not discussion post creator', async () => {
      const discussionPost = await new database.post({
        userId: null,
      }).save();
      await expect(
        service.isPostCreator(
          fakeDocuments.user._id.toString(),
          discussionPost._id.toString(),
        ),
      ).rejects.toThrowError(AUTH_ERRORS.FORBIDDEN_FOR_USER);
    });

    it('should return true if user is discussion post creator', async () => {
      const discussionPost = await new database.post({
        userId: fakeDocuments.user._id,
      }).save();
      await expect(
        service.isPostCreator(
          fakeDocuments.user._id.toString(),
          discussionPost._id.toString(),
        ),
      ).resolves.toEqual(true);
    });
  });

  describe('isReactionCreator', () => {
    it('should be defined', () => {
      expect(service.isReactionCreator).toBeDefined();
    });

    it('should raise exception if user is not discussion post reaction creator', async () => {
      const reaction = await new database.reaction({
        userId: null,
      }).save();
      await expect(
        service.isReactionCreator(
          fakeDocuments.user._id.toString(),
          reaction._id.toString(),
        ),
      ).rejects.toThrowError(AUTH_ERRORS.FORBIDDEN_FOR_USER);
    });

    it('should return true if user is discussion post reaction creator', async () => {
      const reaction = await new database.reaction({
        userId: fakeDocuments.user._id,
      }).save();
      await expect(
        service.isReactionCreator(
          fakeDocuments.user._id.toString(),
          reaction._id.toString(),
        ),
      ).resolves.toEqual(true);
    });
  });

  describe('isDiscussionMember', () => {
    it('should be defined', () => {
      expect(service.isDiscussionMember).toBeDefined();
    });

    it('should raise exception if user is not discussion member', async () => {
      const discussion = await new database.discussion({
        facilitators: null,
      }).save();
      await expect(
        service.isDiscussionMember(
          fakeDocuments.user._id.toString(),
          discussion._id.toString(),
        ),
      ).rejects.toThrowError(AUTH_ERRORS.FORBIDDEN_FOR_USER);
    });

    it('should return true if user is discussion member', async () => {
      const discussion = await new database.discussion({
        facilitators: fakeDocuments.user._id,
      }).save();
      await expect(
        service.isDiscussionMember(
          fakeDocuments.user._id.toString(),
          discussion._id.toString(),
        ),
      ).resolves.toEqual(true);
    });

    it('should return true if user is discussion participant  member', async () => {
      const discussion = await new database.discussion({
        participants: [{ user: fakeDocuments.user._id }],
      }).save();

      await expect(
        service.isDiscussionMember(
          fakeDocuments.user._id.toString(),
          discussion._id.toString(),
        ),
      ).resolves.toEqual(true);
    });

    it('should raise error if discussion is not found', async () => {
      await expect(
        service.isDiscussionMember(
          fakeDocuments.user._id.toString(),
          faker.database.mongoObjectIdString(),
        ),
      ).rejects.toThrowError(AUTH_ERRORS.DISCUSSION_NOT_FOUND);
    });
  });

  describe('isScoreCreator', () => {
    it('should be defined', () => {
      expect(service.isScoreCreator).toBeDefined();
    });

    it('should raise exception if user is not score creator', async () => {
      const score = await new database.score({
        creatorId: null,
      }).save();
      await expect(
        service.isScoreCreator(
          fakeDocuments.user._id.toString(),
          score._id.toString(),
        ),
      ).rejects.toThrowError(AUTH_ERRORS.FORBIDDEN_FOR_USER);
    });

    it('should return true if user is score creator', async () => {
      const score = await new database.score({
        creatorId: fakeDocuments.user._id,
      }).save();
      await expect(
        service.isScoreCreator(
          fakeDocuments.user._id.toString(),
          score._id.toString(),
        ),
      ).resolves.toEqual(true);
    });
  });

  describe('isCalendarCreator', () => {
    it('should be defined', () => {
      expect(service.isCalendarCreator).toBeDefined();
    });

    it('should raise exception if user is not calendar creator', async () => {
      const calendar = await new database.calendar({
        creator: null,
      }).save();
      await expect(
        service.isCalendarCreator(
          fakeDocuments.user._id.toString(),
          calendar._id.toString(),
        ),
      ).rejects.toThrowError(AUTH_ERRORS.FORBIDDEN_FOR_USER);
    });

    it('should return true if user is calendar creator', async () => {
      const calendar = await new database.calendar({
        creator: fakeDocuments.user._id,
      }).save();
      await expect(
        service.isCalendarCreator(
          fakeDocuments.user._id.toString(),
          calendar._id.toString(),
        ),
      ).resolves.toEqual(true);
    });
  });

  describe('verifyMongoIds', () => {
    it('should be defined', () => {
      expect(service.verifyMongoIds).toBeDefined();
    });

    it('should raise exception if mongo id is invalid', async () => {
      expect(() => service.verifyMongoIds(['a'])).toThrowError(
        AUTH_ERRORS.INVALID_ID,
      );
    });
  });
});

// describe('AuthService', () => {
//   test('it should instantiate', async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AuthService,
//         { provide: getModelToken('User'), useValue: {} },
//         { provide: getModelToken('Discussion'), useValue: {} },
//         { provide: getModelToken('DiscussionPost'), useValue: {} },
//         { provide: getModelToken('Score'), useValue: {} },
//         { provide: getModelToken('Calendar'), useValue: {} },
//         { provide: getModelToken('Reaction'), useValue: {} },
//       ],
//     }).compile();

//     const service = module.get<AuthService>(AuthService);
//     expect(service).toBeDefined();
//     expect(bcrypt).toBeDefined();
//     // bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');
//   });
// });
