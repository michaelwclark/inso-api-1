// import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
// import { getModelToken } from '@nestjs/mongoose';
import { connect, Connection, Model, Types } from 'mongoose';

import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

// import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

jest.mock('@nestjs/jwt');
jest.setTimeout(10000);
// jest.mock('../modules/milestone/milestone.service');

// export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
//   MongooseModule.forRootAsync({
//     useFactory: async () => {
//       mongod = new MongoMemoryServer();
//       const mongoUri = await mongod.getUri();
//       return {
//         uri: mongoUri,
//         ...options,
//       };
//     },
//   });

// export const closeInMongodConnection = async () => {
//   if (mongod) await mongod.stop();
// };

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
  // const mockJwtService = <jest.Mock<JwtService>>JwtService;
  // const mockJwtSign = <jest.Mock>jwt.sign;

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
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    const { User, UserSchema } = await import('../entities/user/user');

    const { Discussion, DiscussionSchema } = await import(
      '../entities/discussion/discussion'
    );
    const { DiscussionPost, DiscussionPostSchema } = await import(
      '../entities/post/post'
    );
    const { Score, ScoreSchema } = await import('../entities/score/score');
    const { Calendar, CalendarSchema } = await import(
      '../entities/calendar/calendar'
    );
    const { Reaction, ReactionSchema } = await import(
      '../entities/reaction/reaction'
    );

    discussionModel = mongoConnection.model(Discussion.name, DiscussionSchema);
    discussionPostModel = mongoConnection.model(
      DiscussionPost.name,
      DiscussionPostSchema,
    );
    scoreModel = mongoConnection.model(Score.name, ScoreSchema);
    calendarModel = mongoConnection.model(Calendar.name, CalendarSchema);
    userModel = mongoConnection.model(User.name, UserSchema);
    reactionModel = mongoConnection.model(Reaction.name, ReactionSchema);

    const tempUser = new userModel({
      _id: new Types.ObjectId('629a3aaa17d028a1f19f0e5c'),
      username: 'mockuser1234',
    });
    await userModel.insertMany([tempUser]);

    service = new AuthService(
      new JwtService(),
      discussionModel,
      discussionPostModel,
      scoreModel,
      calendarModel,
      userModel,
      reactionModel,
    );

    // const module: TestingModule = await Test.createTestingModule({
    //   imports: [
    //     rootMongooseTestModule(),
    //     MongooseModule.forFeature([
    //       { name: Discussion.name, schema: DiscussionSchema },
    //     ]),
    //     MongooseModule.forFeature([
    //       { name: DiscussionPost.name, schema: DiscussionPostSchema },
    //     ]),
    //     MongooseModule.forFeature([{ name: Score.name, schema: ScoreSchema }]),
    //     MongooseModule.forFeature([
    //       { name: Calendar.name, schema: CalendarSchema },
    //     ]),
    //     MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    //     MongooseModule.forFeature([
    //       { name: Reaction.name, schema: ReactionSchema },
    //     ]),
    //   ],
    //   providers: [AuthService],
    // }).compile();

    // service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
