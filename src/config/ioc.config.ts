import { Container } from 'inversify';
import { TYPES_AUTH, TYPES_HEALTH, TYPES_COUNTRY, TYPES_COMMON, TYPES_INTEGRATIONS } from './ioc.types';

import { PrismaService } from '../services/prisma.service';

import { AuthRepository } from '../modules/auth/auth.repository';
import { AuthService } from '../modules/auth/auth.service';
import { AuthController } from '../modules/auth/auth.controller';

import { HealthController } from '../modules/health/health.controller';

import { CountryRepository } from '../modules/country/country.repository';
import { CountryService } from '../modules/country/country.service';
import { CountryController } from '../modules/country/country.controller';

import { AzureBlobStorageService } from '../integrations/upload/azure.adapter';
import { UploadService } from '../integrations/upload/upload.service';
import { SmtpEmailService } from '../integrations/notification/smtp.adapter';
import { EmailService } from '../integrations/notification/email.service';
import { StripePaymentService } from '../integrations/payment/stripe.adapter';
import { PaymentService } from '../integrations/payment/payment.service';

const container = new Container();

container.bind<HealthController>(TYPES_HEALTH.HealthController).to(HealthController);

container.bind<PrismaService>(TYPES_COMMON.PrismaService).to(PrismaService);
container.bind<CountryService>(TYPES_COUNTRY.CountryService).to(CountryService);

container.bind<CountryRepository>(TYPES_COUNTRY.CountryRepository).to(CountryRepository);
container.bind<CountryController>(TYPES_COUNTRY.CountryController).to(CountryController);

container.bind<AuthRepository>(TYPES_AUTH.AuthRepository).to(AuthRepository);
container.bind<AuthService>(TYPES_AUTH.AuthService).to(AuthService);
container.bind<AuthController>(TYPES_AUTH.AuthController).to(AuthController);

container.bind<UploadService>(TYPES_INTEGRATIONS.UploadService).to(AzureBlobStorageService);
container.bind<EmailService>(TYPES_INTEGRATIONS.EmailService).to(SmtpEmailService);
container.bind<PaymentService>(TYPES_INTEGRATIONS.PaymentService).to(StripePaymentService);

export default container;
