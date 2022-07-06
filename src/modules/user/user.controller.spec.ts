import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Connection, Model, connect, Types } from "mongoose";
import { User, UserSchema } from "src/entities/user/user";
import { UserController } from "./user.controller";
import { validUser } from "./userMocks";

describe('AppController', () => {

    let appController: UserController;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let userModel: Model<any>;

    beforeAll(async() => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
        userModel = mongoConnection.model(User.name, UserSchema);

        const testUser = {
            '_id': new Types.ObjectId('62c455f417ad4b255d93cb3a'),
            'username': 'NewUser',
            'f_name': 'Diego',
            'l_name': 'Soto',
            'contact': [{
                'email': 'diegosoto@gmail.com'
            }],
            'sso': ['string'],
            'password': 'adFDG8h&oo',
            'level': 'string',
            'subject': 'string'
        }
        await userModel.insertMany([testUser]);

        const app: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [{provide: getModelToken(User.name), useValue: userModel}]
        }).compile();

        appController = app.get<UserController>(UserController);
    })

    describe('Get 200 STATUS', () => {
        it('Test case valid get request', async ()=> {
            const result = await appController.getUser('62c455f417ad4b255d93cb3a');
            const returnObject = {
                'first name': 'Diego',
                'last name': 'Soto',
                'username': 'NewUser',
                'contact': [{
                    'email': 'diegosoto@gmail.com'
                }],
                'level': 'string',
                'subject': 'string'
            }
            var stringResult = result.toString();
            expect(stringResult).toBe(returnObject.toString());
        }) 
    });

    describe('POST /user 200 STATUS', () => {
        it('Test case valid request', async ()=> {
            const result = await appController.createUser(validUser);
            expect(result).toBe('User Created!')
        }) 
    });


});