import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { decodeOta } from 'src/drivers/otaDriver';
import { AuthService } from './auth.service';

jest.mock('src/drivers/otaDriver');

describe('AuthController e2e', () => {
  let authController: AuthController;

  const authServiceMock = {
    login: jest.fn(),
    resetPasswordFromEmail: jest.fn(),
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
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('POST /auth/login', () => {
    it('Should return OK when valid user login', async () => true);
    it('Should return NOT_FOUND when user not found', async () => true);
    it('Should return BAD_REQUEST when user signed up with SSO', async () =>
      true);
    it('Should return UNAUTHORIZED when password is incorrect', async () =>
      true);
  });

  describe('GET /profile', () => {
    it('Should return OK when valid token', async () => true);
    it('Should return BAD_REQUEST when token invalid', async () => true);
  });

  describe('PATCH /users/:userId/reset-password', () => {
    it('Should return OK when password reset', async () => true);
    it('Should return BAD_REQUEST when password not in right format', async () =>
      true);
    it('Should return FORBIDDEN when user ids do not match', async () => true);
  });

  describe('PATCH /users/reset-password/:ota', () => {
    it('Should return OK when password reset', async () => {
      const ota = '123456';
      const password = 'Password#23333';

      (decodeOta as jest.Mock).mockResolvedValue({
        data: {
          userId: '123456',
        },
      });
      const response = await authController.resetPasswordOta(ota, password);
      expect(decodeOta).toBeCalledWith(ota);
      expect(authServiceMock.resetPasswordFromEmail).toBeCalledWith(
        '123456',
        password,
      );
      expect(response).toEqual('Password updated!');
    });
  });
});
