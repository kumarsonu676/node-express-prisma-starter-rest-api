import request from 'supertest';
import express from 'express';
import { AuthController } from '../../modules/auth/auth.controller';
import { AuthService } from '../../modules/auth/auth.service';
import { RoleName } from '../../modules/auth/auth.types';
import { validate } from '../../middleware/validate.middleware';
import { loginSchema, refreshTokenSchema } from '../../modules/auth/auth.validation';

jest.mock('../../config/ioc.config', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock('../../utils/auth/jwt.util', () => ({
  generateTokens: jest.fn().mockReturnValue({
    accessToken: 'access_token',
    refreshToken: 'refresh_token',
    expiresIn: 3600,
    refreshExpiresIn: 604800,
  }),
  verifyRefreshToken: jest.fn(),
}));

jest.mock('../../utils/auth/password.util', () => ({
  verifyPassword: jest.fn(),
}));

jest.mock('../../utils/api-response', () => ({
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

jest.mock('../../middleware/error.middleware', () => ({
  errorHandler: jest.fn(),
}));

describe('Auth Routes', () => {
  let app: express.Application;
  let mockAuthService: jest.Mocked<AuthService>;

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

    const container = require('../../config/ioc.config').default;
    container.get.mockReturnValue(mockAuthService);

    const authController = new AuthController();
    
    app = express();
    app.use(express.json());
    app.post('/auth/login', validate({ body: loginSchema }), authController.login);
    app.post('/auth/refresh-token', validate({ body: refreshTokenSchema }), authController.refreshToken);
    app.get('/auth/me', authController.getCurrentUser);
  });

  describe('POST /auth/login', () => {
    it('should return 200 and tokens on successful login', async () => {
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'testuser', password: 'password' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toEqual(mockLoginResponse);
    });

    it('should return 400 if username is missing', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ password: 'password' });

      expect(response.status).toBe(400);
    });

    it('should return 400 if password is missing', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'testuser' });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /auth/refresh-token', () => {
    it('should return 200 and new tokens on valid refresh token', async () => {
      const tokenResponse = {
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
        expiresIn: 3600,
        refreshExpiresIn: 604800,
      };
      mockAuthService.refreshToken.mockResolvedValue(tokenResponse);

      const response = await request(app)
        .post('/auth/refresh-token')
        .send({ refreshToken: 'valid_refresh_token' });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(tokenResponse);
    });

    it('should return 400 if refresh token is missing', async () => {
      const response = await request(app)
        .post('/auth/refresh-token')
        .send({});

      expect(response.status).toBe(400);
    });
  });
});
