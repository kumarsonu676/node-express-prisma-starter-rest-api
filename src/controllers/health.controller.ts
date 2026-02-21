import { Request, Response } from "express";

export class HealthController {
  public async checkHealth(req: Request, res: Response): Promise<Response> {
    return res.status(200).json({ status: "UP" });
  }
}
