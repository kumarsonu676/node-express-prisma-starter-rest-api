import { Router } from 'express';

import { HealthController } from '../controllers/health.controller';
import { TYPES } from '../config/ioc.types';
import container from '../config/ioc.config';

const healthRouter = Router();

const healthController = container.get<HealthController>(TYPES.HealthController);

healthRouter.get('/check', healthController.checkHealth);

export default healthRouter;
