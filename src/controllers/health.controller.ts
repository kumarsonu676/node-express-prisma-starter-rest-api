import { Request, Response } from 'express';

export class HealthController {
  constructor() {}

  public checkHealth = async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).json({ status: 'UP' });
  };
}
