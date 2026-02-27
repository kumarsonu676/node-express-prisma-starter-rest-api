import { Request, Response } from 'express';
import container from '../../config/ioc.config';
import { TYPES_AUTH } from '../../config/ioc.types';
import { AuthService } from './auth.service';
import { ok } from '../../utils/api-response';
import { asyncHandler } from '../../utils/asyncHandler';
import type { LoginDto, RefreshTokenDto } from './auth.validation';

export class AuthController {
  constructor(private authService = container.get<AuthService>(TYPES_AUTH.AuthService)) {
    this.authService = authService;
  }

  public login = asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body as LoginDto;
    const result = await this.authService.login(username, password);
    return ok(req, res, result);
  });

  public refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body as RefreshTokenDto;
    const tokens = await this.authService.refreshToken(refreshToken);
    return ok(req, res, tokens);
  });

  public getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user!;
    const currentUser = await this.authService.getCurrentUser(user.userId);
    return ok(req, res, currentUser);
  });
}
