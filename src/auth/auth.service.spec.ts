import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model, Types } from 'mongoose';
import { User, UserSchema } from 'src/entities/user/user';
import { UserController } from 'src/modules/user/user.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './guards/jwt.strategy';

describe('AuthService', () => {
  let service: AuthService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let userModel: Model<any>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    userModel = mongoConnection.model(User.name, UserSchema);

    const tempUser = new userModel({
      _id: new Types.ObjectId('629a3aaa17d028a1f19f0e5c'),
      username: 'mockuser1234',
    });
    await userModel.insertMany([tempUser]);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthService], // flipped from providers
      providers: [
        UserController,
        JwtService,
        JwtStrategy,
        { provide: getModelToken(User.name), useValue: userModel },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
