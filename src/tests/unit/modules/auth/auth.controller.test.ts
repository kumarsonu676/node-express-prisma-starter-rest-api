import { AuthController } from '../../../../modules/auth/auth.controller';
import { AuthService } from '../../../../modules/auth/auth.service';
import { RoleName } from '../../../../modules/auth/auth.types';
import { Request, Response, NextFunction } from 'express';

jest.mock('../../../../config/ioc.config', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock('../../../../utils/api-response', () => ({
  ok: jest.fn().mockImplementation((req: any, res: any, data: any) => {
    return res.status(200).json({
      status: 'success',
      statusCode: 200,
      data,
      timestamp: new Date().toISOString(),
      requestId: req.id,
    });
  }),
}));

describe('AuthController', () => {
  let authController: AuthController;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  const mockLoginResponse = {
    user: {
      id: 'user-123',
      username: 'testuser',
      email: 'test@example.com',
      roles: [RoleName.USER],
    },
    tokens: {
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
      expiresIn: 3600,
      refreshExpiresIn: 604800,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockAuthService = {
      login: jest.fn(),
      refreshToken: jest.fn(),
      getCurrentUser: jest.fn(),
      validateUser: jest.fn(),
      generateTokens: jest.fn(),
      sendWelcomeEmail: jest.fn(),
      sendLoginNotification: jest.fn(),
    } as any;

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockRequest = {
      body: {},
      user: undefined,
      id: 'test-request-id',
    } as any;

    mockResponse = {
      status: statusMock,
      json: jsonMock,
    } as any;

    mockNext = jest.fn();

    const container = require('../../../../config/ioc.config').default;
    container.get.mockReturnValue(mockAuthService);

    authController = new AuthController();
  });

  describe('login', () => {
    it('should login successfully', async () => {
      mockRequest.body = { username: 'testuser', password: 'password' };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const loginHandler = authController.login;
      await loginHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAuthService.login).toHaveBeenCalledWith('testuser', 'password');
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          statusCode: 200,
          data: mockLoginResponse,
        })
      );
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      mockRequest.body = { refreshToken: 'valid_refresh_token' };
      const tokenResponse = {
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
        expiresIn: 3600,
        refreshExpiresIn: 604800,
      };
      mockAuthService.refreshToken.mockResolvedValue(tokenResponse);

      const refreshHandler = authController.refreshToken;
      await refreshHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAuthService.refreshToken).toHaveBeenCalledWith('valid_refresh_token');
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          statusCode: 200,
          data: tokenResponse,
        })
      );
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      mockRequest.user = { userId: 'user-123', username: 'testuser', roles: [RoleName.USER] };
      const currentUser = {
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        roles: [RoleName.USER],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockAuthService.getCurrentUser.mockResolvedValue(currentUser);

      const getUserHandler = authController.getCurrentUser;
      await getUserHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAuthService.getCurrentUser).toHaveBeenCalledWith('user-123');
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          statusCode: 200,
          data: currentUser,
        })
      );
    });
  });
});
