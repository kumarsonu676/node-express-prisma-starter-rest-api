import { generateTokens, verifyAccessToken, verifyRefreshToken, decodeToken } from '../../../utils/auth/jwt.util';

describe('JWT Utilities', () => {
  const payload = {
    userId: '123',
    username: 'testuser',
    roles: ['USER'],
    email: 'test@example.com',
  };

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', () => {
      const tokens = generateTokens(payload);

      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
      expect(tokens.expiresIn).toBeGreaterThan(0);
      expect(tokens.refreshExpiresIn).toBeGreaterThan(0);
    });

    it('should generate different access and refresh tokens', () => {
      const tokens = generateTokens(payload);

      expect(tokens.accessToken).not.toBe(tokens.refreshToken);
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify valid access token', () => {
      const tokens = generateTokens(payload);
      const decoded = verifyAccessToken(tokens.accessToken);

      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.username).toBe(payload.username);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.roles).toEqual(payload.roles);
    });

    it('should throw on invalid token', () => {
      expect(() => verifyAccessToken('invalid-token')).toThrow();
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify valid refresh token', () => {
      const tokens = generateTokens(payload);
      const decoded = verifyRefreshToken(tokens.refreshToken);

      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.tokenId).toBeDefined();
    });
  });

  describe('decodeToken', () => {
    it('should decode token without verification', () => {
      const tokens = generateTokens(payload);
      const decoded = decodeToken(tokens.accessToken);

      expect(decoded).not.toBeNull();
      expect(decoded?.userId).toBe(payload.userId);
    });

    it('should return null for invalid token', () => {
      const decoded = decodeToken('invalid-token');
      expect(decoded).toBeNull();
    });
  });
});
