import { Container } from 'inversify';
import { TYPES } from './ioc.types';

import { HealthController } from '../controllers/health.controller';
import { PrismaService } from '../services/prisma.service';
import { CountryRepository } from '../repositories/country.respository';
import { CountryService } from '../services/country.service';
import UnitOfService from '../services/unitof.service';

const container = new Container();

container.bind<HealthController>(TYPES.HealthController).to(HealthController);

container.bind<PrismaService>(TYPES.PrismaService).to(PrismaService);
container.bind<UnitOfService>(TYPES.UnitOfService).to(UnitOfService);
container.bind<CountryService>(TYPES.CountryService).to(CountryService);

container.bind<CountryRepository>(TYPES.CountryRepository).to(CountryRepository);

export default container;
