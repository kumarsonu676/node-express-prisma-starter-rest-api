import { Router } from 'express';
import container from '../../config/ioc.config';
import { TYPES_AUTH } from '../../config/ioc.types';
import { AuthController } from './auth.controller';
import { loginSchema, refreshTokenSchema } from './auth.validation';
import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

const authController = container.get<AuthController>(TYPES_AUTH.AuthController);

router.post('/login', validate({ body: loginSchema }), authController.login);
router.post('/refresh-token', validate({ body: refreshTokenSchema }), authController.refreshToken);
router.get('/me', authenticate, authController.getCurrentUser);

export default router;
