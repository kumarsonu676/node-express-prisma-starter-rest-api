import { Request, Response } from 'express';
import { ok } from '../../utils/api-response';

export class HealthController {
  public checkHealth = async (req: Request, res: Response): Promise<Response> => {
    return ok(req, res, { status: 'UP' });
  };
}
