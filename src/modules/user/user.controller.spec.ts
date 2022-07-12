import { HttpException, HttpStatus } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Connection, Model, connect, Types } from "mongoose";
import { UserCreateDTO } from "src/entities/user/create-user";
import { UserEditDTO } from "src/entities/user/edit-user";
import { User, UserSchema } from "src/entities/user/user";
import { UserController } from "./user.controller";
import { contactArrayWrongType, contactEmailNotAnEmail, contactEmailNotAnEmailPatch, contactEmailNotString, contactEmpty, contactEmptyArray, contactEmptyEmail, contactNotArray, dummy, existingUsername, existingUsernamePatch, existingUsernamePatch2, fnameEmpty, fnameNotString, levelEmpty, levelNotString, lnameEmpty, lnameNotString, newValidBody, passwordEmpty, passwordNoLowercase, passwordNoNumber, passwordNoSpecialChar, passwordNotString, passwordNoUppercase, passwordTooShort, ssoArrayElementsEmpty, ssoArrayWrongType, ssoEmpty, ssoEmptyArray, ssoEmptyArrayPatch, ssoNotArray, subjectEmpty, subjectNotString, userInvalidCharactersAmt, userInvalidCharactersAmtPatch, usernameBadWord, usernameBadWordPatch, usernameEmailAdd, usernameEmailAddPatch, usernameEmpty, userNotString, validUser } from "./userMocks";

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

    describe('Get /user/:userId 200 STATUS', () => {
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

    describe('POST /user 400 STATUS', () => {
        it('Test case username not a string', async () => {
            const user = plainToInstance(UserCreateDTO, userNotString);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('username must be a string');
        }) // FINISHED

        it('Test case username is empty', async () => {
            const user = plainToInstance(UserCreateDTO, usernameEmpty);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('username should not be empty');
        }) // FINISHED

        it('Test case invalid amount of characters in username', ()=> {
            const error = new HttpException("Username length must be at least 5 characters and no more than 32", HttpStatus.BAD_REQUEST);
            return expect( appController.createUser(userInvalidCharactersAmt)).rejects.toThrow(error);
        }) // FINISHED

        it('Test case username is a bad word', ()=> {
            const error = new HttpException("Username cannot contain obscene or profain language", HttpStatus.BAD_REQUEST);
            return expect( appController.createUser(usernameBadWord)).rejects.toThrow(error);
        }) // FINISHED

        it('Test case username is an email address', ()=> {
            const error = new HttpException("Username cannot be an email address", HttpStatus.BAD_REQUEST);
            return expect( appController.createUser(usernameEmailAdd)).rejects.toThrow(error);
        }) // FINISHED

        it('Test case username already exists', ()=> {
            const error = new HttpException("Username already exists, please choose another", HttpStatus.BAD_REQUEST);
            return expect( appController.createUser(existingUsername)).rejects.toThrow(error);
        }) // FINISHED

        it('Test case f_name not a string', async () => {
            const user = plainToInstance(UserCreateDTO, fnameNotString);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('f_name must be a string');
        }) // FINISHED

        it('Test case f_name is empty', async () => {
            const user = plainToInstance(UserCreateDTO, fnameEmpty);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('f_name should not be empty');
        }) // FINISHED

        it('Test case l_name not a string', async () => {
            const user = plainToInstance(UserCreateDTO, lnameNotString);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('l_name must be a string');
        }) // FINISHED

        it('Test case l_name is empty', async () => {
            const user = plainToInstance(UserCreateDTO, lnameEmpty);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('l_name should not be empty');
        }) // FINISHED

        it('Test case password not a string', async () => {
            const user = plainToInstance(UserCreateDTO, passwordNotString);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('password must be a string');
        }) // FINISHED

        it('Test case password is empty', async () => {
            const user = plainToInstance(UserCreateDTO, passwordEmpty);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('password should not be empty');
        }) // FINISHED

        it('Test case password length too short', ()=> {
            const error = new HttpException("Password length must be at least 8 characters and no more than 32", HttpStatus.BAD_REQUEST);
            return expect( appController.createUser(passwordTooShort)).rejects.toThrow(error);
        }) // FINISHED

        it('Test case password missing lowercase character', ()=> {
            const error = new HttpException("Password must contain at least one lowercase character", HttpStatus.BAD_REQUEST);
            return expect( appController.createUser(passwordNoLowercase)).rejects.toThrow(error);
        }) // FINISHED

        it('Test case password missing uppercase character', ()=> {
            const error = new HttpException("Password must contain at least one uppercase character", HttpStatus.BAD_REQUEST);
            return expect( appController.createUser(passwordNoUppercase)).rejects.toThrow(error);
        }) // FINIHSED

        it('Test case password missing number', ()=> {
            const error = new HttpException("Password must contain at least one number", HttpStatus.BAD_REQUEST);
            return expect( appController.createUser(passwordNoNumber)).rejects.toThrow(error);
        }) // FINISHED

        it('Test case password missing special character', ()=> {
            const error = new HttpException("Password must contain at least one special character", HttpStatus.BAD_REQUEST);
            return expect( appController.createUser(passwordNoSpecialChar)).rejects.toThrow(error);
        })  // FINISHED

        it('Test case contact is empty', async () => {
            const user = plainToInstance(UserCreateDTO, contactEmpty);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('contact should not be empty');
        })  // FINISHED

        it('Test case contact is not an array', async () => {
            const user = plainToInstance(UserCreateDTO, contactNotArray);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('contact must be an array');
        })  // FINISHED

        it('Test case contact is an empty array', async () => {
            const error = new HttpException("Array length for contacts cannot be 0", HttpStatus.BAD_REQUEST);
            return expect( appController.createUser(contactEmptyArray)).rejects.toThrow(error);
        }) // FINISHED

        it('Test case contact array is of wrong type', async () => {
            const user = plainToInstance(UserCreateDTO, contactArrayWrongType);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('each value in nested property contact must be either object or array');
        }) // FINISHED

        it('Test case contact email is not a string', async () => {
            const user = plainToInstance(UserCreateDTO, contactEmailNotString);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('email must be a string');
        }) // FINISHED

        it('Test case contact email is empty', async () => {
            const user = plainToInstance(UserCreateDTO, contactEmptyEmail);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('email should not be empty');
        }) // FINISHED

        it('Test case contact email is not a valid email address', async () => {
            const error = new HttpException("Email: " + contactEmailNotAnEmail.contact[0].email + ", is not a valid email address", HttpStatus.BAD_REQUEST);
            return expect( appController.createUser(contactEmailNotAnEmail)).rejects.toThrow(error);
        }) // FINISHED
    })

    describe('PATCH /user/:userId 200 STATUS', () => {
        it('Test case valid request', async ()=> {
            const result = await appController.updateUser('62c455f417ad4b255d93cb3a', newValidBody);
            expect (result).toBe('User Updated')
        }) // FINISHED
    })

    describe('PATCH /user/:userId 400 STATUS', () => {
        it('Test case no user id', ()=> {
            const error = new HttpException("No user id provided", HttpStatus.BAD_REQUEST);
            return expect( appController.updateUser(null, dummy)).rejects.toThrow(error);
        }) // FINISHED

        it('Test case invalid user id', ()=> {
            const error = new HttpException("User id is not valid", HttpStatus.BAD_REQUEST);
            return expect( appController.updateUser('notAValidUserId', dummy)).rejects.toThrow(error);
        }) // FINISHED

        it('Test case username not a string', async () => {
            const user = plainToInstance(UserEditDTO, userNotString);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('username must be a string');
        }) // FINISHED

        it('Test case username is empty', async () => {
            const user = plainToInstance(UserEditDTO, usernameEmpty);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('username should not be empty');
        }) // FINISHED

        it('Test case invalid amount of characters in username', ()=> {
            const error = new HttpException("Username length must be at least 5 characters and no more than 32", HttpStatus.BAD_REQUEST);
            return expect( appController.updateUser('62c455f417ad4b255d93cb3a', userInvalidCharactersAmtPatch)).rejects.toThrow(error);
        }) // FINISHED

        it('Test case username is a bad word', ()=> {
            const error = new HttpException("Username cannot contain obscene or profain language", HttpStatus.BAD_REQUEST);
            return expect( appController.updateUser('62c455f417ad4b255d93cb3a', usernameBadWordPatch)).rejects.toThrow(error);
        }) // FINISHED

        it('Test case username is an email address', ()=> {
            const error = new HttpException("Username cannot be an email address", HttpStatus.BAD_REQUEST);
            return expect( appController.updateUser('62c455f417ad4b255d93cb3a', usernameEmailAddPatch)).rejects.toThrow(error);
        }) // FINISHED

        it('Test case username already exists', ()=> {
            const error = new HttpException("Username already exists, please choose another", HttpStatus.BAD_REQUEST);
            return expect( appController.updateUser('62c455f417ad4b255d93cb3a', existingUsernamePatch2)).rejects.toThrow(error);
        }) // FINISHED

        it('Test case f_name not a string', async () => {
            const user = plainToInstance(UserEditDTO, fnameNotString);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('f_name must be a string');
        }) // FINISHED

        it('Test case f_name is empty', async () => {
            const user = plainToInstance(UserEditDTO, fnameEmpty);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('f_name should not be empty');
        }) // FINISHED

        it('Test case l_name not a string', async () => {
            const user = plainToInstance(UserEditDTO, lnameNotString);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('l_name must be a string');
        }) // FINISHED

        it('Test case l_name is empty', async () => {
            const user = plainToInstance(UserEditDTO, lnameEmpty);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('l_name should not be empty');
        }) // FINISHED

        it('Test case contact is empty', async () => {
            const user = plainToInstance(UserEditDTO, contactEmpty);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('contact should not be empty');
        })  // FINISHED

        it('Test case contact is not an array', async () => {
            const user = plainToInstance(UserEditDTO, contactNotArray);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('contact must be an array');
        })  // FINISHED

        it('Test case contact array is of wrong type', async () => {
            const user = plainToInstance(UserEditDTO, contactArrayWrongType);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('each value in nested property contact must be either object or array');
        }) // FINISHED

        it('Test case contact email is not a string', async () => {
            const user = plainToInstance(UserEditDTO, contactEmailNotString);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('email must be a string');
        }) // FINISHED

        it('Test case contact email is empty', async () => {
            const user = plainToInstance(UserEditDTO, contactEmptyEmail);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('email should not be empty');
        }) // FINISHED

        it('Test case contact email is not a valid email address', async () => {
            const error = new HttpException("Email: " + contactEmailNotAnEmail.contact[0].email + ", is not a valid email address", HttpStatus.BAD_REQUEST);
            return expect( appController.updateUser('62c455f417ad4b255d93cb3a', contactEmailNotAnEmailPatch)).rejects.toThrow(error);
        }) // FINISHED

        it('Test case sso is empty', async () => {
            const user = plainToInstance(UserEditDTO, ssoEmpty);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('sso should not be empty');
        }) // FINISHED

        it('Test case sso is not an array', async () => {
            const user = plainToInstance(UserEditDTO, ssoNotArray);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('sso must be an array');
        }) // FINISHED

        it('Test case sso is an empty array', async () => {
            const error = new HttpException("Array length for SSO cannot be 0", HttpStatus.BAD_REQUEST);
            return expect( appController.updateUser('62c455f417ad4b255d93cb3a', ssoEmptyArrayPatch)).rejects.toThrow(error);
        }) // FINISHED

        it('Test case sso array is of wrong type', async () => {
            const user = plainToInstance(UserEditDTO, ssoArrayWrongType);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('each value in sso must be a string');
        }) // FINISHED

        it('Test case sso array is of empty strings', async () => {
            const user = plainToInstance(UserEditDTO, ssoArrayElementsEmpty);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('each value in sso should not be empty');
        }) // FINISHED

        it('Test case level is not a string', async () => {
            const user = plainToInstance(UserEditDTO, levelNotString);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('level must be a string');
        }) // FINISHED

        it('Test case level is empty', async () => {
            const user = plainToInstance(UserEditDTO, levelEmpty);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('level should not be empty');
        }) // FINISHED

        it('Test case subject is not a string', async () => {
            const user = plainToInstance(UserEditDTO, subjectNotString);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('subject must be a string');
        }) // FINISHED

        it('Test case subject is empty', async () => {
            const user = plainToInstance(UserEditDTO, subjectEmpty);
            const errors = await validate(user);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors)).toContain('subject should not be empty');
        }) // FINISHED
    })

    describe('PATCH /user/:userId 404 STATUS', () => {
        it('Test case nonexistent user id', ()=> {
            const error = new HttpException("User does not exist", HttpStatus.NOT_FOUND);
            return expect( appController.updateUser('62bc8a1278e753fdc93a16dc', dummy)).rejects.toThrow(error);
        }) // FINISHED
    })
});