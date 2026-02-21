import { injectable } from 'inversify';
import container from '../config/ioc.config';
import { TYPES } from '../config/ioc.types';
import { CountryRepository } from '../repositories/country.respository';

@injectable()
export class CountryService {
  constructor(private countryRepository = container.get<CountryRepository>(TYPES.CountryRepository)) {
    this.countryRepository = countryRepository;
  }

  async getAllCountries() {
    return this.countryRepository.findAll();
  }
}
