import { Container } from 'inversify';
import { TYPES } from './ioc.types';

import { HealthController } from '../controllers/health.controller';
import { PrismaService } from '../services/prisma.service';

const container = new Container();

container.bind<HealthController>(TYPES.HealthController).to(HealthController);

container.bind<PrismaService>(TYPES.PrismaService).to(PrismaService);

export default container;
