import { Router } from 'express';
import container from '../../config/ioc.config';
import { TYPES_HEALTH } from '../../config/ioc.types';
import { HealthController } from './health.controller';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

const healthController = container.get<HealthController>(TYPES_HEALTH.HealthController);

router.get('/check', asyncHandler(healthController.checkHealth));

export default router;
