import { Router, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec, swaggerUiOptions } from '../swagger';

const router = Router();

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

router.get('/json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

export default router;
