import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getModelToken } from '@nestjs/mongoose';
import { connect, Connection, Model } from 'mongoose';

import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import {
  Discussion,
  DiscussionSchema,
} from 'src/entities/discussion/discussion';
import { DiscussionPost, DiscussionPostSchema } from 'src/entities/post/post';
import { Score, ScoreSchema } from 'src/entities/score/score';
import { User, UserSchema } from 'src/entities/user/user';
import { Reaction, ReactionSchema } from 'src/entities/reaction/reaction';
import { Calendar, CalendarSchema } from 'src/entities/calendar/calendar';
import * as bcrypt from 'bcrypt';
import { GoogleUserDTO } from '../entities/user/google-user';
import { validatePassword } from 'src/entities/user/commonFunctions/validatePassword';
import { UserReadDTO } from 'src/entities/user/read-user';
import authErrors from './auth-errors';

jest.mock('bcrypt');
jest.mock('@nestjs/jwt');
jest.mock('../entities/user/google-user');
jest.mock('src/entities/user/commonFunctions/validatePassword');
jest.mock('src/entities/user/read-user');
const bcryptCompare = jest.spyOn(bcrypt, 'compare');
const bcryptHash = jest.spyOn(bcrypt, 'hash');
const jwtSign = jest.spyOn(JwtService.prototype, 'sign');

describe('AuthService', () => {
  let service: AuthService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let discussionModel: Model<any>;
  let discussionPostModel: Model<any>;
  let scoreModel: Model<any>;
  let calendarModel: Model<any>;
  let userModel: Model<any>;
  let reactionModel: Model<any>;

  let module: TestingModule;
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;

    discussionModel = mongoConnection.model(Discussion.name, DiscussionSchema);
    discussionPostModel = mongoConnection.model(
      DiscussionPost.name,
      DiscussionPostSchema,
    );
    scoreModel = mongoConnection.model(Score.name, ScoreSchema);
    calendarModel = mongoConnection.model(Calendar.name, CalendarSchema);
    userModel = mongoConnection.model(User.name, UserSchema);
    reactionModel = mongoConnection.model(Reaction.name, ReactionSchema);
    module = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        { provide: getModelToken(Discussion.name), useValue: discussionModel },
        {
          provide: getModelToken(DiscussionPost.name),
          useValue: discussionPostModel,
        },
        { provide: getModelToken(Score.name), useValue: scoreModel },
        { provide: getModelToken(Calendar.name), useValue: calendarModel },
        { provide: getModelToken(User.name), useValue: userModel },

        { provide: getModelToken(Reaction.name), useValue: reactionModel },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  afterEach(async () => {
    await userModel.deleteMany({});
    await discussionModel.deleteMany({});
    await discussionPostModel.deleteMany({});
    await scoreModel.deleteMany({});
    await calendarModel.deleteMany({});
    await reactionModel.deleteMany({});
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
        authErrors.EMAIL_NOT_FOUND,
      );
    });

    it('should raise an error if user is found but has no password (SSO configured)', async () => {
      await new userModel({
        username: 'mockuser1234',
        contact: {
          email: 'mockuser@inso.com',
        },
      }).save();

      await expect(
        service.validateUser('mockuser@inso.com', 'asdf'),
      ).rejects.toEqual(authErrors.SSO_CONFIGURED);
    });

    it('should raise an error if the passwords to not match', async () => {
      await new userModel({
        username: 'mock_user_bad_password',
        contact: {
          email: 'mock_user_bad_password@inso.com',
        },
        password: 'asdf',
      }).save();

      bcryptCompare.mockImplementation(() => Promise.resolve(false));

      await expect(
        service.validateUser('mock_user_bad_password@inso.com', 'asdf1'),
      ).rejects.toEqual(authErrors.INVALID_PASSWORD);
    });

    it('should call login if user found and valid password', async () => {
      const oldLogin = service.login;
      service.login = jest.fn();
      bcryptCompare.mockImplementation(() => Promise.resolve(true));

      await new userModel({
        username: 'mock_user_good_password',
        contact: {
          email: 'mock_user_good_password@inso.com',
        },
        password: 'asdf',
      }).save();

      await service.validateUser('mock_user_good_password@inso.com', 'asdf');
      expect(service.login).toHaveBeenCalled();
      expect(bcrypt.compare).toHaveBeenCalledWith('asdf', 'asdf');
      service.login = oldLogin;
    });
  });

  describe('login', () => {
    it('should be defined', () => {
      expect(service.login).toBeDefined();
    });

    it('should return a jwt token', async () => {
      const userPayload = {
        username: 'mock_user_good_password',
        _id: '1234',
      };
      jwtSign.mockImplementation(() => 'token');
      const token = await service.login(userPayload);
      expect.assertions(2);
      expect(token).toBeDefined();
      expect(jwtSign).toHaveBeenCalledWith({
        username: 'mock_user_good_password',
        sub: '1234',
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
        authErrors.USER_NOT_FOUND_GOOGLE,
      );
    });

    it('should look for user by email', async () => {
      await new userModel({
        username: 'mock_user_good_password',
        contact: {
          email: 'googleUser@inso.com',
        },
      }).save();

      jest.spyOn(userModel, 'findOne');
      const payload = {
        user: {
          email: 'googleUser@inso.com',
        },
      };
      service.googleLogin(payload);
      expect(userModel.findOne).toHaveBeenCalledWith({
        'contact.email': 'googleUser@inso.com',
      });
    });

    it('should sign jwt if user found by email', async () => {
      await new userModel({
        username: 'mock_user_good_password',
        contact: {
          email: 'googleUser@inso.com',
        },
      }).save();

      jest.spyOn(userModel, 'findOne');
      const payload = {
        user: {
          email: 'googleUser@inso.com',
        },
      };
      jwtSign.mockImplementation(() => 'Googletoken');
      const token = await service.googleLogin(payload);
      expect(userModel.findOne).toHaveBeenCalledWith({
        'contact.email': 'googleUser@inso.com',
      });
      expect(token).toEqual({
        access_token: 'Googletoken',
      });
    });

    it('should lookup username based on first and last name', async () => {
      await new userModel({
        username: 'mock_user_good_password',
        contact: {
          email: 'googleUser@inso.com',
        },
      }).save();

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
      await new userModel({
        username: `JohnDoe`,
      }).save();
      for (let index = 0; index < 101; index++) {
        await new userModel({
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
      const user = await new userModel({}).save();
      bcryptCompare.mockImplementation(() => Promise.resolve(false));
      await expect(
        service.resetPassword(user._id, 'asdf', 'asdf1'),
      ).rejects.toEqual(
        new HttpException(
          'Invalid credentials, old password is not correct',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should validate passowrd if passwords match', async () => {
      const user = await new userModel({}).save();
      bcryptCompare.mockImplementation(() => Promise.resolve(true));
      await service.resetPassword(user._id, 'oldPass', 'newPass');
      expect(validatePassword).toHaveBeenCalledWith('newPass');
    });

    it('should update passowrd if passwords match', async () => {
      const user = await new userModel({}).save();
      jest.spyOn(userModel, 'findOneAndUpdate');

      bcryptCompare.mockImplementation(() => Promise.resolve(true));
      bcryptHash.mockImplementation(() => Promise.resolve('newPassHash'));
      await service.resetPassword(user._id, 'oldPass', 'newPass');
      expect(userModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: user._id },
        { password: 'newPassHash' },
      );
    });
  });

  describe('resetPasswordFromEmail', () => {
    it('should be defined', () => {
      expect(service.resetPasswordFromEmail).toBeDefined();
    });

    it('should verify mongoIds', async () => {
      const user = await new userModel({}).save();
      jest.spyOn(service, 'verifyMongoIds');
      await service.resetPasswordFromEmail(user._id, 'asdf');
      expect(service.verifyMongoIds).toHaveBeenCalledWith([user._id]);
    });

    it('should validate passowrd', async () => {
      const user = await new userModel({}).save();

      await service.resetPasswordFromEmail(user._id, 'asdf');
      expect(validatePassword).toHaveBeenCalledWith('asdf');
    });

    it('should set new passowrd', async () => {
      const user = await new userModel({}).save();

      bcryptHash.mockImplementation(() => Promise.resolve('newPassHash'));
      jest.spyOn(userModel, 'findOneAndUpdate');
      await service.resetPasswordFromEmail(user._id, 'asdf');
      expect(userModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: user._id },
        { password: 'newPassHash' },
      );
    });
  });

  describe('fetchUserAndStats', () => {
    it('should be defined', () => {
      expect(service.fetchUserAndStats).toBeDefined();
    });

    it('should fetch discussions for user', async () => {
      const user = await new userModel({}).save();
      jest.spyOn(discussionModel, 'find');
      await service.fetchUserAndStats(user._id);
      expect(discussionModel.find).toHaveBeenCalledWith({
        poster: user._id,
      });
    });

    it('should fetch discussions joined for the user', async () => {
      const user = await new userModel({}).save();
      jest.spyOn(discussionModel, 'find');
      await service.fetchUserAndStats(user._id);
      expect(discussionModel.find).toHaveBeenCalledWith({
        'participants.user': user._id,
      });
    });

    it('should fetch posts created for the user', async () => {
      const user = await new userModel({}).save();
      jest.spyOn(discussionPostModel, 'find');
      await service.fetchUserAndStats(user._id);
      expect(discussionPostModel.find).toHaveBeenCalledWith({
        userId: user._id,
      });
    });

    it('should fetch comments recieved for user posts', async () => {
      const user = await new userModel({}).save();
      jest.spyOn(discussionPostModel, 'find');
      await service.fetchUserAndStats(user._id);
      expect(discussionPostModel.find).toHaveBeenCalledWith({
        comment_for: { $in: [] },
      });
    });

    it('should fetch upvotes for user', async () => {
      const user = await new userModel({}).save();
      jest.spyOn(reactionModel, 'find');
      await service.fetchUserAndStats(user._id);
      expect(reactionModel.find).toHaveBeenCalledWith({
        postId: { $in: [] },
        reaction: '+1',
      });
    });

    it('should return UserReadDTO', async () => {
      const user = await new userModel({}).save();
      const result = await service.fetchUserAndStats(user._id);
      expect(UserReadDTO).toHaveBeenCalledWith({
        ...user.toObject(),
        statistics: {
          discussions_created: 0,
          discussions_joined: 0,
          posts_made: 0,
          comments_received: 0,
          upvotes: 0,
        },
      });
      expect(result).toEqual({});
    });

    it('should return UserReadDTO populated with stats', async () => {
      const user = await new userModel({
        _id: '5e9f1b9b9b9b9b9b9b9b9b9b',
      }).save();
      await new discussionModel({
        poster: user._id,
      }).save();
      await new discussionModel({
        poster: user._id,
      }).save();

      await new discussionModel({
        participants: {
          user: user._id,
        },
      }).save();
      await new discussionModel({
        participants: {
          user: user._id,
        },
      }).save();
      await new discussionModel({
        participants: {
          user: user._id,
        },
      }).save();

      await new discussionPostModel({
        userId: user._id,
      }).save();

      const post1 = await new discussionPostModel({
        userId: user._id,
      }).save();
      const post2 = await new discussionPostModel({
        userId: user._id,
      }).save();
      const post3 = await new discussionPostModel({
        userId: user._id,
      }).save();

      await new discussionPostModel({
        comment_for: [post1._id],
      }).save();
      await new discussionPostModel({
        comment_for: [post1._id],
      }).save();
      await new discussionPostModel({
        comment_for: [post2._id],
      }).save();
      await new discussionPostModel({
        comment_for: [post3._id],
      }).save();

      await new reactionModel({
        postId: post1._id,
        reaction: '+1',
      }).save();
      await new reactionModel({
        postId: post1._id,
        reaction: '+1',
      }).save();
      await new reactionModel({
        postId: post2._id,
        reaction: '+1',
      }).save();
      await new reactionModel({
        postId: post3._id,
        reaction: '+1',
      }).save();

      const result = await service.fetchUserAndStats(user._id);
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
      const user = await new userModel({}).save();
      const discussion = await new discussionModel({ poster: null }).save();
      await expect(
        service.isDiscussionCreator(user._id, discussion._id),
      ).rejects.toThrowError(authErrors.FORBIDDEN_FOR_USER);
    });

    it('should return true if user is discussion creator', async () => {
      const user = await new userModel({}).save();
      const discussion = await new discussionModel({ poster: user._id }).save();
      await expect(
        service.isDiscussionCreator(user._id, discussion._id),
      ).resolves.toEqual(true);
    });
  });

  describe('isDiscussionFacilitator', () => {
    it('should be defined', () => {
      expect(service.isDiscussionFacilitator).toBeDefined();
    });

    it('should raise exception if user is not discussion Facilitator', async () => {
      const user = await new userModel({}).save();
      const discussion = await new discussionModel({
        facilitators: [],
      }).save();

      expect.assertions(1);
      await expect(
        service.isDiscussionFacilitator(
          user._id.toString(),
          discussion._id.toString(),
        ),
      ).rejects.toThrowError(authErrors.FORBIDDEN_FOR_USER);
    });

    it('should return true if user is discussion Facilitator', async () => {
      const user = await new userModel({}).save();
      const discussion = await new discussionModel({
        facilitators: [user._id],
      }).save();
      const result = await service.isDiscussionFacilitator(
        user._id.toString(),
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
      const user = await new userModel({}).save();
      await expect(
        service.isDiscussionParticipant(user._id, '5e9f1b9b9b9b9b9b9b9b9b9b'),
      ).rejects.toThrowError(authErrors.DISCUSSION_NOT_FOUND);
    });

    it('should raise exception if user is not discussion Participant', async () => {
      const user = await new userModel({}).save();
      const discussion = await new discussionModel({
        participants: [],
      }).save();
      await expect(
        service.isDiscussionParticipant(user._id, discussion._id),
      ).rejects.toThrowError(authErrors.FORBIDDEN_FOR_USER);
    });

    it('should return true if user is discussion Participant', async () => {
      const user = await new userModel({}).save();
      const discussion = await new discussionModel({
        participants: [
          {
            user: user._id,
          },
        ],
      }).save();

      discussion.participants.push({
        user: user._id,
      });
      await discussion.save();
      const result = await service.isDiscussionParticipant(
        user._id.toString(),
        discussion._id,
      );
      expect(result).toEqual(true);
    });
  });

  describe('isPostCreator', () => {
    it('should be defined', () => {
      expect(service.isPostCreator).toBeDefined();
    });

    it('should raise exception if user is not discussion post creator', async () => {
      const user = await new userModel({}).save();
      const discussionPost = await new discussionPostModel({
        userId: null,
      }).save();
      await expect(
        service.isPostCreator(user._id, discussionPost._id),
      ).rejects.toThrowError(authErrors.FORBIDDEN_FOR_USER);
    });

    it('should return true if user is discussion post creator', async () => {
      const user = await new userModel({}).save();
      const discussionPost = await new discussionPostModel({
        userId: user._id,
      }).save();
      await expect(
        service.isPostCreator(user._id, discussionPost._id),
      ).resolves.toEqual(true);
    });
  });

  describe('isReactionCreator', () => {
    it('should be defined', () => {
      expect(service.isReactionCreator).toBeDefined();
    });

    it('should raise exception if user is not discussion post reaction creator', async () => {
      const user = await new userModel({}).save();
      const reaction = await new reactionModel({
        userId: null,
      }).save();
      await expect(
        service.isReactionCreator(user._id, reaction._id),
      ).rejects.toThrowError(authErrors.FORBIDDEN_FOR_USER);
    });

    it('should return true if user is discussion post reaction creator', async () => {
      const user = await new userModel({}).save();
      const reaction = await new reactionModel({
        userId: user._id,
      }).save();
      await expect(
        service.isReactionCreator(user._id, reaction._id),
      ).resolves.toEqual(true);
    });
  });

  describe('isDiscussionMember', () => {
    it('should be defined', () => {
      expect(service.isDiscussionMember).toBeDefined();
    });

    it('should raise exception if user is not discussion member', async () => {
      const user = await new userModel({}).save();
      const discussion = await new discussionModel({
        facilitators: null,
      }).save();
      await expect(
        service.isDiscussionMember(user._id, discussion._id),
      ).rejects.toThrowError(authErrors.FORBIDDEN_FOR_USER);
    });

    it('should return true if user is discussion member', async () => {
      const user = await new userModel({}).save();
      const discussion = await new discussionModel({
        facilitators: user._id,
      }).save();
      await expect(
        service.isDiscussionMember(user._id, discussion._id),
      ).resolves.toEqual(true);
    });

    it('should return true if user is discussion participant  member', async () => {
      const user = await new userModel({}).save();
      const discussion = await new discussionModel({
        participants: [{ user: user._id }],
      }).save();

      await expect(
        service.isDiscussionMember(user._id.toString(), discussion._id),
      ).resolves.toEqual(true);
    });

    it('should raise error if discussion is not fonud', async () => {
      const user = await new userModel({}).save();
      await expect(
        service.isDiscussionMember(user._id, '5e9f1b9b9b9b9b9b9b9b9b9b'),
      ).rejects.toThrowError(authErrors.DISCUSSION_NOT_FOUND);
    });
  });

  describe('isScoreCreator', () => {
    it('should be defined', () => {
      expect(service.isScoreCreator).toBeDefined();
    });

    it('should raise exception if user is not score creator', async () => {
      const user = await new userModel({}).save();
      const score = await new scoreModel({
        creatorId: null,
      }).save();
      await expect(
        service.isScoreCreator(user._id, score._id),
      ).rejects.toThrowError(authErrors.FORBIDDEN_FOR_USER);
    });

    it('should return true if user is score creator', async () => {
      const user = await new userModel({}).save();
      const score = await new scoreModel({
        creatorId: user._id,
      }).save();
      await expect(
        service.isScoreCreator(user._id, score._id),
      ).resolves.toEqual(true);
    });
  });

  describe('isCalendarCreator', () => {
    it('should be defined', () => {
      expect(service.isCalendarCreator).toBeDefined();
    });

    it('should raise exception if user is not calendar creator', async () => {
      const user = await new userModel({}).save();
      const calendar = await new calendarModel({
        creator: null,
      }).save();
      await expect(
        service.isCalendarCreator(user._id, calendar._id),
      ).rejects.toThrowError(authErrors.FORBIDDEN_FOR_USER);
    });

    it('should return true if user is calendar creator', async () => {
      const user = await new userModel({}).save();
      const calendar = await new calendarModel({
        creator: user._id,
      }).save();
      await expect(
        service.isCalendarCreator(user._id, calendar._id),
      ).resolves.toEqual(true);
    });
  });

  describe('verifyMongoIds', () => {
    it('should be defined', () => {
      expect(service.verifyMongoIds).toBeDefined();
    });

    it('should raise exception if mongo id is invalid', async () => {
      expect(() => service.verifyMongoIds(['a'])).toThrowError(
        authErrors.INVALID_ID,
      );
    });
  });
});
