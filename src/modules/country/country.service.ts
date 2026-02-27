import { injectable } from 'inversify';
import container from '../../config/ioc.config';
import { TYPES_COUNTRY } from '../../config/ioc.types';
import { CountryRepository } from './country.repository';

@injectable()
export class CountryService {
  constructor(private countryRepository = container.get<CountryRepository>(TYPES_COUNTRY.CountryRepository)) {
    this.countryRepository = countryRepository;
  }

  async getAllCountries() {
    return this.countryRepository.findAll();
  }

  async getCountryByCode(code: string) {
    return this.countryRepository.findByCode(code);
  }

  async getCountryByCodeIso3(codeIso3: string) {
    return this.countryRepository.findByCodeIso3(codeIso3);
  }
}
