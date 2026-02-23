import { Request, Response } from 'express';
import container from '../config/ioc.config';
import { TYPES } from '../config/ioc.types';
import UnitOfService from '../services/unitof.service';
import { ok } from '../utils/api-response';

export class HealthController {
  constructor(private unitOfService = container.get<UnitOfService>(TYPES.UnitOfService)) {
    this.unitOfService = unitOfService;
  }

  public checkHealth = async (req: Request, res: Response): Promise<Response> => {
    return ok(req, res, { status: 'UP' });
  };
}
