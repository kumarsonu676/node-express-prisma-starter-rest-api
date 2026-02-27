import { Request } from 'express';

//export type RoleName = 'ADMIN' | 'USER';
export enum RoleName {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface AuthPayload {
  userId: string;
  username: string;
  roles: RoleName[];
}

export interface JwtUser {
  userId: string;
  username: string;
  email?: string;
  roles: RoleName[];
}

export interface RequestWithUser extends Request {
  user?: JwtUser;
}

export interface LoginResponse {
  user: {
    id: string;
    username: string;
    email: string | null;
    roles: RoleName[];
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    refreshExpiresIn: number;
  };
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
}

export interface CurrentUserResponse {
  id: string;
  username: string;
  email: string | null;
  roles: RoleName[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
