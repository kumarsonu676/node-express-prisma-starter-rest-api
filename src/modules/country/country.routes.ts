import { Router } from 'express';
import container from '../../config/ioc.config';
import { TYPES_COUNTRY } from '../../config/ioc.types';
import { CountryController } from './country.controller';

const router = Router();

const countryController = container.get<CountryController>(TYPES_COUNTRY.CountryController);

router.get('/', countryController.getAllCountries);
router.get('/code/:code', countryController.getCountryByCode);
router.get('/code-iso3/:codeIso3', countryController.getCountryByCodeIso3);

export default router;
