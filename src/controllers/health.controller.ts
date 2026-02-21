import { Request, Response } from 'express';
import container from '../config/ioc.config';
import { TYPES } from '../config/ioc.types';
import UnitOfService from '../services/unitof.service';

export class HealthController {
  constructor(private unitOfService = container.get<UnitOfService>(TYPES.UnitOfService)) {
    this.unitOfService = unitOfService;
  }

  public checkHealth = async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).json({ status: 'UP' });
  };
}
