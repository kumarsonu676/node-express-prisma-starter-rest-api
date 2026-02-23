import { Router } from 'express';

import { HealthController } from '../controllers/health.controller';
import { TYPES } from '../config/ioc.types';
import container from '../config/ioc.config';
import { asyncHandler } from '../utils/asyncHandler';

const healthRouter = Router();

const healthController = container.get<HealthController>(TYPES.HealthController);

/**
 * @swagger
 * /api/health/check:
 *   get:
 *     summary: Check API health status
 *     description: Returns the current health status of the API
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: UP
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 requestId:
 *                   type: string
 */

healthRouter.get('/check', asyncHandler(healthController.checkHealth));

export default healthRouter;
