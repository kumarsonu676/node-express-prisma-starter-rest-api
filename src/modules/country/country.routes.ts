import { Router } from 'express';
import container from '../../config/ioc.config';
import { TYPES_COUNTRY } from '../../config/ioc.types';
import { CountryController } from './country.controller';
import { validate } from '../../middleware/validate.middleware';
import { countryCodeSchema, countryCodeIso3Schema } from './country.validation';

const router = Router();

const countryController = container.get<CountryController>(TYPES_COUNTRY.CountryController);

router.get('/', countryController.getAllCountries);
router.get('/code/:code', validate({ params: countryCodeSchema }), countryController.getCountryByCode);
router.get('/code-iso3/:codeIso3', validate({ params: countryCodeIso3Schema }), countryController.getCountryByCodeIso3);

export default router;
