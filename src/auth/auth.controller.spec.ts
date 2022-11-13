import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import faker from 'test/faker';
import { PasswordResetDTO } from 'src/entities/user/password-reset';
import authErrors from './auth-errors';
import { decodeOta } from 'src/drivers/otaDriver';

jest.mock('src/drivers/otaDriver');

describe('AuthController', () => {
  let authController: AuthController;
  let mockRequest: any;
  let mockUser: any;

  const authServiceMock = {
    login: jest.fn(),
    resetPasswordFromEmail: jest.fn(),
    fetchUserAndStats: jest.fn(() => mockUser),
    resetPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    mockUser = {
      id: faker.database.mongoObjectIdString(),
      email: faker.internet.email(),
      access_token: faker.random.alphaNumeric(32),
    };

    mockRequest = {
      user: {
        userId: mockUser.id,
        access_token: faker.random.alphaNumeric(32),
      },
    };
  });

  describe('login (POST /auth/login)', () => {
    describe('200 OK', () => {
      it('should return user', async () => {
        const result = await authController.login(mockRequest);
        expect(result).toEqual(mockRequest.user);
      });
    });
  });

  describe('getProfile (GET /profile)', () => {
    describe('200 OK', () => {
      it('should return user', async () => {
        const result = await authController.getProfile(mockRequest);
        expect(authServiceMock.fetchUserAndStats).toHaveBeenCalledWith(
          mockRequest.user.userId,
        );
        expect(result).toEqual(mockUser);
      });
    });
  });

  describe('resetPasswordLoggedIn (PATCH /users/:userId/reset-password)', () => {
    const passwordResetDto = <PasswordResetDTO>{
      oldPassword: faker.random.alphaNumeric(32),
      newPassword: faker.random.alphaNumeric(32),
    };
    describe('200 OK', () => {
      it('should update password with password service', async () => {
        const result = await authController.resetPasswordLoggedIn(
          mockUser.id,
          passwordResetDto,
          mockRequest,
        );
        expect(authServiceMock.resetPassword).toHaveBeenCalledWith(
          mockUser.id,
          passwordResetDto.oldPassword,
          passwordResetDto.newPassword,
        );
        expect(result).toEqual('Password updated!');
      });
    });

    describe('403 Forbidden', () => {
      it('throw error when users do not match', async () => {
        const badReq = {
          user: {
            access_token: faker.random.alphaNumeric(32), // eslint-disable-line camelcase
            userId: faker.database.mongoObjectIdString(),
          },
        };

        return await expect(
          authController.resetPasswordLoggedIn(
            faker.database.mongoObjectIdString(),
            passwordResetDto,
            badReq,
          ),
        ).rejects.toThrow(authErrors.FORBIDDEN_FOR_USER);
      });
    });
  });

  describe('resetPasswordOta (PATCH /users/reset-password/:ota)', () => {
    let mockOtaCode, mockPassword;
    beforeEach(() => {
      mockOtaCode = faker.random.alphaNumeric(4);
      mockPassword = faker.random.alphaNumeric(32);
      const mockDecodeOta = jest.mocked(decodeOta);

      mockDecodeOta.mockResolvedValue({
        data: {
          userId: mockUser.id,
        },
        action: faker.random.alphaNumeric(32),
        iat: faker.random.alphaNumeric(),
        exp: faker.random.alphaNumeric(),
        iss: faker.random.alphaNumeric(),
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('200 OK', () => {
      it('should reset password with from email with auth service', async () => {
        const result = await authController.resetPasswordOta(
          mockOtaCode,
          mockPassword,
        );

        expect(decodeOta).toHaveBeenCalledWith(mockOtaCode);
        expect(authServiceMock.resetPasswordFromEmail).toHaveBeenCalledWith(
          mockUser.id,
          mockPassword,
        );

        expect(result).toEqual('Password updated!');
      });
    });
  });
});
