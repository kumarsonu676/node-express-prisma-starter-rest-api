import { Container } from 'inversify';
import { TYPES, TYPES_AUTH } from './ioc.types';

import { HealthController } from '../controllers/health.controller';
import { PrismaService } from '../services/prisma.service';
import { CountryRepository } from '../repositories/country.respository';
import { CountryService } from '../services/country.service';
import UnitOfService from '../services/unitof.service';

import { AuthRepository } from '../modules/auth/auth.repository';
import { AuthService } from '../modules/auth/auth.service';
import { AuthController } from '../modules/auth/auth.controller';

const container = new Container();

container.bind<HealthController>(TYPES.HealthController).to(HealthController);

container.bind<PrismaService>(TYPES.PrismaService).to(PrismaService);
container.bind<UnitOfService>(TYPES.UnitOfService).to(UnitOfService);
container.bind<CountryService>(TYPES.CountryService).to(CountryService);

container.bind<CountryRepository>(TYPES.CountryRepository).to(CountryRepository);

container.bind<AuthRepository>(TYPES_AUTH.AuthRepository).to(AuthRepository);
container.bind<AuthService>(TYPES_AUTH.AuthService).to(AuthService);
container.bind<AuthController>(TYPES_AUTH.AuthController).to(AuthController);

export default container;
