import { Router } from 'express';

import { HealthController } from '../controllers/health.controller';
import { TYPES } from '../config/ioc.types';
import container from '../config/ioc.config';
import { asyncHandler } from '../utils/asyncHandler';

const healthRouter = Router();

const healthController = container.get<HealthController>(TYPES.HealthController);

healthRouter.get('/check', asyncHandler(healthController.checkHealth));

export default healthRouter;
