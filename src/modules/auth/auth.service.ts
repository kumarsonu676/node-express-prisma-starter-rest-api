import { injectable } from 'inversify';
import container from '../../config/ioc.config';
import { TYPES_AUTH } from '../../config/ioc.types';
import { AuthRepository } from './auth.repository';
import { verifyPassword } from '../../utils/auth/password.util';
import { generateTokens, verifyRefreshToken, TokenPair } from '../../utils/auth/jwt.util';
import { UnauthorizedError, ErrorCode } from '../../utils/errors';
import type { RoleName, LoginResponse, CurrentUserResponse, JwtUser } from './auth.types';

@injectable()
export class AuthService {
  constructor(private authRepository = container.get<AuthRepository>(TYPES_AUTH.AuthRepository)) {
  }

  async validateUser(username: string, password: string): Promise<JwtUser | null> {
    const user = await this.authRepository.findByUsername(username);

    if (!user || !user.isActive) {
      return null;
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    const roles = user.userRoles.map((ur) => ur.role.name as RoleName);

    return {
      userId: user.id,
      username: user.username,
      email: user.email ?? undefined,
      roles,
    };
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    const user = await this.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedError('Invalid credentials', ErrorCode.INVALID_CREDENTIALS);
    }

    const tokens = this.generateTokens(user);

    const userWithRoles = await this.authRepository.findByIdWithRoles(user.userId);

    if (!userWithRoles) {
      throw new UnauthorizedError('User not found', ErrorCode.INVALID_CREDENTIALS);
    }

    return {
      user: {
        id: userWithRoles.id,
        username: userWithRoles.username,
        email: userWithRoles.email,
        roles: userWithRoles.userRoles.map((ur) => ur.role.name as RoleName),
      },
      tokens,
    };
  }

  generateTokens(user: JwtUser): TokenPair {
    const payload = {
      userId: user.userId,
      username: user.username,
      roles: user.roles,
    };

    return generateTokens(payload);
  }

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    try {
      const decoded = verifyRefreshToken(refreshToken);

      const user = await this.authRepository.findByIdWithRoles(decoded.userId);

      if (!user || !user.isActive) {
        throw new UnauthorizedError('User not found or inactive', ErrorCode.INVALID_CREDENTIALS);
      }

      const roles = user.userRoles.map((ur) => ur.role.name as RoleName);

      const jwtUser: JwtUser = {
        userId: user.id,
        username: user.username,
        email: user.email ?? undefined,
        roles,
      };

      return this.generateTokens(jwtUser);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error;
      }
      throw new UnauthorizedError('Invalid refresh token', ErrorCode.INVALID_TOKEN);
    }
  }

  async getCurrentUser(userId: string): Promise<CurrentUserResponse> {
    const user = await this.authRepository.findByIdWithRoles(userId);

    if (!user) {
      throw new UnauthorizedError('User not found', ErrorCode.USER_NOT_FOUND);
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.userRoles.map((ur) => ur.role.name as RoleName),
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
