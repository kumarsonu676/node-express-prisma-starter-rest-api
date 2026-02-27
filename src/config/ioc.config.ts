import { Container } from 'inversify';
import { TYPES_AUTH, TYPES_HEALTH, TYPES_COUNTRY, TYPES_COMMON } from './ioc.types';

import { PrismaService } from '../services/prisma.service';

import { AuthRepository } from '../modules/auth/auth.repository';
import { AuthService } from '../modules/auth/auth.service';
import { AuthController } from '../modules/auth/auth.controller';

import { HealthController } from '../modules/health/health.controller';

import { CountryRepository } from '../modules/country/country.repository';
import { CountryService } from '../modules/country/country.service';
import { CountryController } from '../modules/country/country.controller';

const container = new Container();

container.bind<HealthController>(TYPES_HEALTH.HealthController).to(HealthController);

container.bind<PrismaService>(TYPES_COMMON.PrismaService).to(PrismaService);
container.bind<CountryService>(TYPES_COUNTRY.CountryService).to(CountryService);

container.bind<CountryRepository>(TYPES_COUNTRY.CountryRepository).to(CountryRepository);
container.bind<CountryController>(TYPES_COUNTRY.CountryController).to(CountryController);

container.bind<AuthRepository>(TYPES_AUTH.AuthRepository).to(AuthRepository);
container.bind<AuthService>(TYPES_AUTH.AuthService).to(AuthService);
container.bind<AuthController>(TYPES_AUTH.AuthController).to(AuthController);

export default container;
