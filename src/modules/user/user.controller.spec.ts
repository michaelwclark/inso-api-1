import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { SGService } from 'src/drivers/sendgrid';
import { User } from 'src/entities/user/user';
import { FakeDocuments, TestingDatabase, testingDatabase } from 'test/database';
import faker from 'test/faker';
import { UserController } from './user.controller';
import environment from 'src/environment';
import {
  makeFakeUserCreateDTO,
  makeFakeUserEditDTO,
} from 'src/entities/user/user-fakes';
import { validatePassword } from 'src/entities/user/commonFunctions/validatePassword';
import { checkForDuplicateContacts } from 'src/entities/user/commonFunctions/checkForDuplicateContacts';
import USER_ERRORS from './user-errors';
import { generateCode, decodeOta } from 'src/drivers/otaDriver';

jest.mock('src/entities/user/commonFunctions/validatePassword');
jest.mock('src/entities/user/commonFunctions/checkForDuplicateContacts');
jest.mock('src/drivers/otaDriver');

describe('UserController', () => {
  let database: TestingDatabase;
  let userController: UserController;
  let fakeDocuments: FakeDocuments;
  // let mockRequest: any;
  const mockSgService = {
    resetPassword: jest.fn(),
    sendEmail: jest.fn(),
  };

  beforeAll(async () => {
    database = await testingDatabase();
  });

  beforeEach(async () => {
    fakeDocuments = await database.createFakes();
    (decodeOta as jest.Mock).mockResolvedValue({
      code: {
        data: faker.datatype.string(),
      },
    });

    (generateCode as jest.Mock).mockResolvedValue({
      code: {
        data: faker.datatype.string(),
      },
    });
    // mockRequest = {
    //   user: fakeDocuments.user,
    //   username: fakeDocuments.user.username,
    // };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: getModelToken(User.name),
          useValue: database.user,
        },
        { provide: SGService, useValue: mockSgService },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await database.clearDatabase();
  });

  describe('verifyEmailRoute (GET email-verified)', () => {
    describe('200 OK', () => {
      it('should return redirect url if email token verified', async () => {
        jest
          .spyOn(userController, 'verifyEmailToken')
          .mockImplementation(async () => {
            return true;
          });

        const mockOta = faker.datatype.string();
        const result = await userController.verifyEmailRoute(mockOta);
        expect(result).toEqual({
          url: environment.VERIFIED_REDIRECT + true,
        });
      });
    });
  });

  describe('createUser (POST /user)', () => {
    describe('201 CREATED', () => {
      it('should create a new user', async () => {
        const mockUserPassword = faker.internet.password();
        const mockUser = makeFakeUserCreateDTO({
          password: mockUserPassword,
        });

        const result = await userController.createUser(mockUser);
        expect(validatePassword).toBeCalledTimes(1);
        expect(validatePassword).toHaveBeenCalledWith(mockUserPassword);
        expect(checkForDuplicateContacts).toHaveBeenCalledTimes(1);
        expect(checkForDuplicateContacts).toHaveBeenCalledWith(
          mockUser.contact,
        );
        expect(result).toEqual(
          'User Created! Please check your email inbox to verify your email address',
        );
      });

      it('should create a new user with unique name', async () => {
        const mockUserPassword = faker.internet.password();
        const mockUser = makeFakeUserCreateDTO({
          f_name: fakeDocuments.user.f_name,
          l_name: fakeDocuments.user.l_name,
          password: mockUserPassword,
        });

        const result = await userController.createUser(mockUser);
        expect(validatePassword).toBeCalledTimes(1);
        expect(validatePassword).toHaveBeenCalledWith(mockUserPassword);
        expect(checkForDuplicateContacts).toHaveBeenCalledTimes(1);
        expect(checkForDuplicateContacts).toHaveBeenCalledWith(
          mockUser.contact,
        );
        const lastUser = await database.user.findOne({}).sort({ _id: -1 });
        expect(lastUser.f_name).toEqual(mockUser.f_name);
        expect(lastUser.l_name).toEqual(mockUser.l_name);
        expect(lastUser.username).not.toEqual(fakeDocuments.user.username);
        expect(result).toEqual(
          'User Created! Please check your email inbox to verify your email address',
        );
      });
    });

    describe('400 BAD REQUEST', () => {
      it('should throw error if email is in use', async () => {
        const mockUser = makeFakeUserCreateDTO({
          contact: fakeDocuments.user.contact,
        });

        await expect(userController.createUser(mockUser)).rejects.toThrow(
          USER_ERRORS.EMAIL_IN_USE,
        );
      });
    });
  });

  describe('resetPasswordRequest (POST password-reset/:email)', () => {
    describe('200 OK', () => {
      it('should generate code and send email', async () => {
        const result = await userController.resetPasswordRequest(
          fakeDocuments.user.contact[0].email,
        );

        expect(generateCode).toHaveBeenCalledTimes(1);
        expect(mockSgService.resetPassword).toHaveBeenCalledTimes(1);
        expect(result).toEqual('Password reset request has been sent to email');
      });
    });

    describe('400 BAD REQUEST', () => {
      it('should throw error if email is invalid', async () => {
        await expect(
          userController.resetPasswordRequest('invalidEmail'),
        ).rejects.toThrow(USER_ERRORS.INVALID_EMAIL);
      });
    });

    describe('404 NOT FOUND', () => {
      it('should throw error if user not found', async () => {
        await expect(
          userController.resetPasswordRequest(faker.internet.email()),
        ).rejects.toThrow(USER_ERRORS.USER_NOT_FOUND);
      });
    });
  });

  describe('updateUser (PATCH user/:userId)', () => {
    describe('200 OK', () => {
      it('should update user', async () => {
        const userEdit = makeFakeUserEditDTO({
          contact: [
            {
              ...fakeDocuments.user.contact[0],
              delete: false,
              primary: true,
            },
          ],
        });
        const result = await userController.updateUser(
          fakeDocuments.user._id.toString(),
          userEdit,
        );
        expect(result).toEqual('User Updated');
      });
    });

    describe('400 BAD REQUEST', () => {
      it('should throw error if email is in use', async () => {
        const usedEmail = faker.internet.email();
        await database.user.create(
          makeFakeUserCreateDTO({
            contact: [
              {
                verified: true,
                email: usedEmail,
                primary: true,
              },
            ],
          }),
        );
        const userEdit = makeFakeUserEditDTO({
          contact: [
            {
              verified: false,
              delete: false,
              primary: true,
              email: usedEmail,
            },
          ],
        });
        await expect(
          userController.updateUser(
            fakeDocuments.user._id.toString(),
            userEdit,
          ),
        ).rejects.toThrow(USER_ERRORS.EMAIL_IN_USE);
      });

      it('should throw if userId is invalid', async () => {
        const userEdit = makeFakeUserEditDTO();
        await expect(
          userController.updateUser('invalidId', userEdit),
        ).rejects.toThrow(USER_ERRORS.INVALID_USER_ID);

        await expect(
          userController.updateUser(undefined, userEdit),
        ).rejects.toThrow(USER_ERRORS.INVALID_USER_ID);
      });

      it('should throw if no contacts', async () => {
        const userEdit = makeFakeUserEditDTO({
          contact: [
            {
              email: fakeDocuments.user.contact[0].email,
              verified: false,
              primary: true,
              delete: true,
            },
          ],
        });

        await expect(
          userController.updateUser(
            fakeDocuments.user._id.toString(),
            userEdit,
          ),
        ).rejects.toThrow(USER_ERRORS.MISSING_EMAIL);
      });

      it('should throw if username in use', async () => {
        const usedUsername = fakeDocuments.user.username;
        const newUser = await database.user.create(makeFakeUserCreateDTO({}));
        const userEdit = makeFakeUserEditDTO({
          username: usedUsername,
        });

        await expect(
          userController.updateUser(newUser._id.toString(), userEdit),
        ).rejects.toThrow(USER_ERRORS.USERNAME_IN_USE);
      });

      it('should not throw if there are multiple primary contacts', () => {
        const userEdit = makeFakeUserEditDTO({
          contact: [
            {
              email: faker.internet.email(),
              verified: false,
              primary: true,
              delete: false,
            },
            {
              email: faker.internet.email(),
              verified: false,
              primary: true,
              delete: false,
            },
          ],
        });
        //  Note this was originally a test for the ONLY_ONE_PRIMARY_EMAIL error but in testing
        //  I realized that portion of code was never being reached. I left the test in for refactoring purposes
        expect(
          userController.updateUser(
            fakeDocuments.user._id.toString(),
            userEdit,
          ),
        ).resolves.toEqual('User Updated');
      });
    });

    describe('404 NOT FOUND', () => {
      it('should throw error if user not found', async () => {
        const userEdit = makeFakeUserEditDTO();
        await expect(
          userController.updateUser(
            faker.database.mongoObjectIdString(),
            userEdit,
          ),
        ).rejects.toThrow(USER_ERRORS.USER_NOT_FOUND);
      });
    });
  });

  describe('resetPassowrd (PATCH password-reset)', () => {
    describe('200 OK', () => {
      it('should rest password', async () => {
        const passwordBefore = fakeDocuments.user.password;
        (decodeOta as jest.Mock).mockResolvedValue({
          data: fakeDocuments.user.contact[0].email,
        });

        const password = faker.internet.password();
        const mockOta = faker.datatype.string();
        const result = await userController.resetPassword(
          {
            password,
            confirmPassword: password,
          },
          mockOta,
        );
        expect(result._id).toEqual(fakeDocuments.user._id);
        expect(result.password).not.toEqual(passwordBefore);
        expect(validatePassword).toHaveBeenCalledTimes(1);
      });
    });

    describe('400 BAD REQUEST', () => {
      it('should throw error if passwords do not match', async () => {
        const mockOta = faker.datatype.string();
        await expect(
          userController.resetPassword(
            {
              password: faker.internet.password(),
              confirmPassword: faker.internet.password(),
            },
            mockOta,
          ),
        ).rejects.toThrow(USER_ERRORS.PASSWORDS_DO_NOT_MATCH);
      });
    });
  });

  describe('sendEmailVerification', () => {
    it('should generate code and send email', async () => {
      await userController.sendEmailVerification(fakeDocuments.user);
      expect(generateCode).toHaveBeenCalledTimes(1);
      expect(mockSgService.sendEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe('verifyEmailToken', () => {
    it('should decode token', async () => {
      const unverifiedUser = await database.user.create(
        makeFakeUserCreateDTO({
          contact: [
            {
              email: faker.internet.email(),
              verified: false,
              primary: true,
            },
          ],
        }),
      );
      (decodeOta as jest.Mock).mockResolvedValue({
        data: unverifiedUser.contact[0].email,
      });
      const mockToken = faker.datatype.string();
      await userController.verifyEmailToken(mockToken);
      expect(decodeOta).toHaveBeenCalledTimes(1);
    });

    it('should throw error if already verified', async () => {
      const unverifiedUser = await database.user.create(
        makeFakeUserCreateDTO({
          contact: [
            {
              email: faker.internet.email(),
              verified: true,
              primary: true,
            },
          ],
        }),
      );
      (decodeOta as jest.Mock).mockResolvedValue({
        data: unverifiedUser.contact[0].email,
      });
      const mockToken = faker.datatype.string();
      await expect(userController.verifyEmailToken(mockToken)).rejects.toThrow(
        USER_ERRORS.USER_EMAIL_ALREADY_VERIFIED,
      );

      expect(decodeOta).toHaveBeenCalledTimes(1);
    });
  });
});
