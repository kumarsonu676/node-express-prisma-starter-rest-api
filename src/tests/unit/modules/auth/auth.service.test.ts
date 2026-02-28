import { AuthService } from '../../../../modules/auth/auth.service';
import { AuthRepository } from '../../../../modules/auth/auth.repository';
import { UnauthorizedError } from '../../../../utils/errors';
import { EmailService } from '../../../../integrations/notification/email.service';
import { RoleName } from '../../../../modules/auth/auth.types';

jest.mock('../../../../config/ioc.config', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock('../../../../integrations/notification/email.service', () => ({
  EmailService: class MockEmailService {
    sendEmail = jest.fn();
  },
}));

jest.mock('../../../../utils/auth/password.util', () => ({
  verifyPassword: jest.fn(),
}));

jest.mock('../../../../utils/auth/jwt.util', () => ({
  generateTokens: jest.fn().mockReturnValue({
    accessToken: 'access_token',
    refreshToken: 'refresh_token',
    expiresIn: 3600,
    refreshExpiresIn: 604800,
  }),
  verifyRefreshToken: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let mockAuthRepository: jest.Mocked<AuthRepository>;
  let mockEmailService: jest.Mocked<EmailService>;
  let mockVerifyPassword: jest.MockedFunction<any>;
  let mockGenerateTokens: jest.MockedFunction<any>;
  let mockVerifyRefreshToken: jest.MockedFunction<any>;

  const mockUser: any = {
    id: 'user-123',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashed_password',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    userRoles: [
      {
        id: 'mapping-1',
        userId: 'user-123',
        roleId: 'role-1',
        createdAt: new Date(),
        role: {
          id: 'role-1',
          name: RoleName.USER,
          createdAt: new Date(),
          updatedAt: new Date(),
          description: null,
        },
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockAuthRepository = {
      findByUsername: jest.fn(),
      findByIdWithRoles: jest.fn(),
    } as any;

    mockEmailService = {
      sendEmail: jest.fn(),
    } as any;

    mockVerifyPassword = require('../../../../utils/auth/password.util').verifyPassword as jest.MockedFunction<any>;
    mockGenerateTokens = require('../../../../utils/auth/jwt.util').generateTokens as jest.MockedFunction<any>;
    mockVerifyRefreshToken = require('../../../../utils/auth/jwt.util').verifyRefreshToken as jest.MockedFunction<any>;

    const container = require('../../../../config/ioc.config').default;
    container.get.mockImplementation((symbol: symbol) => {
      const symbolStr = symbol.toString();
      if (symbolStr.includes('AuthRepository')) return mockAuthRepository;
      if (symbolStr.includes('EmailService')) return mockEmailService;
      return null;
    });

    authService = new AuthService();
  });

  describe('validateUser', () => {
    it('should return null if user not found', async () => {
      mockAuthRepository.findByUsername.mockResolvedValue(null);

      const result = await authService.validateUser('nonexistent', 'password');

      expect(result).toBeNull();
      expect(mockAuthRepository.findByUsername).toHaveBeenCalledWith('nonexistent');
    });

    it('should return null if user is inactive', async () => {
      mockAuthRepository.findByUsername.mockResolvedValue({ ...mockUser, isActive: false });

      const result = await authService.validateUser('testuser', 'password');

      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      mockAuthRepository.findByUsername.mockResolvedValue(mockUser);
      mockVerifyPassword.mockResolvedValue(false);

      const result = await authService.validateUser('testuser', 'wrongpassword');

      expect(result).toBeNull();
    });

    it('should return jwt user if credentials are valid', async () => {
      mockAuthRepository.findByUsername.mockResolvedValue(mockUser);
      mockVerifyPassword.mockResolvedValue(true);

      const result = await authService.validateUser('testuser', 'correctpassword');

      expect(result).toEqual({
        userId: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        roles: [RoleName.USER],
      });
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedError if credentials are invalid', async () => {
      mockAuthRepository.findByUsername.mockResolvedValue(null);

      await expect(authService.login('testuser', 'password')).rejects.toThrow(UnauthorizedError);
    });

    it('should return login response with tokens on success', async () => {
      mockAuthRepository.findByUsername.mockResolvedValue(mockUser);
      mockVerifyPassword.mockResolvedValue(true);
      mockAuthRepository.findByIdWithRoles.mockResolvedValue(mockUser);
      mockGenerateTokens.mockReturnValue({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
        expiresIn: 3600,
        refreshExpiresIn: 604800,
      });

      const result = await authService.login('testuser', 'password');

      expect(result.user).toEqual({
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        roles: [RoleName.USER],
      });
      expect(result.tokens.accessToken).toBe('access_token');
    });

    it('should throw error if user not found after validation', async () => {
      mockAuthRepository.findByUsername.mockResolvedValue(mockUser);
      mockVerifyPassword.mockResolvedValue(true);
      mockAuthRepository.findByIdWithRoles.mockResolvedValue(null);

      await expect(authService.login('testuser', 'password')).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('generateTokens', () => {
    it('should generate token pair', () => {
      const tokens = authService.generateTokens({
        userId: 'user-123',
        username: 'testuser',
        roles: [RoleName.USER],
      });

      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
      expect(tokens.expiresIn).toBeGreaterThan(0);
    });
  });

  describe('refreshToken', () => {
    it('should throw error if token is invalid', async () => {
      mockVerifyRefreshToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.refreshToken('invalid_token')).rejects.toThrow(UnauthorizedError);
    });

    it('should throw error if user not found', async () => {
      mockVerifyRefreshToken.mockReturnValue({ userId: 'user-123', username: 'test', roles: [RoleName.USER], tokenId: 'token-123' });
      mockAuthRepository.findByIdWithRoles.mockResolvedValue(null);

      await expect(authService.refreshToken('valid_token')).rejects.toThrow(UnauthorizedError);
    });

    it('should throw error if user is inactive', async () => {
      mockVerifyRefreshToken.mockReturnValue({ userId: 'user-123', username: 'test', roles: [RoleName.USER], tokenId: 'token-123' });
      mockAuthRepository.findByIdWithRoles.mockResolvedValue({ ...mockUser, isActive: false });

      await expect(authService.refreshToken('valid_token')).rejects.toThrow(UnauthorizedError);
    });

    it('should return new tokens on success', async () => {
      mockVerifyRefreshToken.mockReturnValue({ userId: 'user-123', username: 'test', roles: [RoleName.USER], tokenId: 'token-123' });
      mockAuthRepository.findByIdWithRoles.mockResolvedValue(mockUser);
      mockGenerateTokens.mockReturnValue({
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
        expiresIn: 3600,
        refreshExpiresIn: 604800,
      });

      const result = await authService.refreshToken('valid_token');

      expect(result.accessToken).toBe('new_access_token');
    });
  });

  describe('getCurrentUser', () => {
    it('should throw error if user not found', async () => {
      mockAuthRepository.findByIdWithRoles.mockResolvedValue(null);

      await expect(authService.getCurrentUser('invalid-id')).rejects.toThrow(UnauthorizedError);
    });

    it('should return current user on success', async () => {
      mockAuthRepository.findByIdWithRoles.mockResolvedValue(mockUser);

      const result = await authService.getCurrentUser('user-123');

      expect(result).toEqual({
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        roles: [RoleName.USER],
        isActive: true,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
    });
  });

  describe('sendWelcomeEmail', () => {
    it('should send welcome email', async () => {
      await authService.sendWelcomeEmail('test@example.com', 'testuser');

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@example.com',
          subject: 'Welcome to Cricko!',
        })
      );
    });
  });

  describe('sendLoginNotification', () => {
    it('should send login notification', async () => {
      await authService.sendLoginNotification('test@example.com', 'testuser', '192.168.1.1');

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@example.com',
          subject: 'New login to your account',
        })
      );
    });
  });
});
