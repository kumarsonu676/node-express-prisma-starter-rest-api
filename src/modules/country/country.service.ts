import { injectable } from 'inversify';
import container from '../../config/ioc.config';
import { TYPES_COUNTRY } from '../../config/ioc.types';
import { CountryRepository } from './country.repository';
import type { CountryDto, CountryListResponse } from './country.types';

@injectable()
export class CountryService {
  constructor(private countryRepository = container.get<CountryRepository>(TYPES_COUNTRY.CountryRepository)) {
    this.countryRepository = countryRepository;
  }

  private mapToDto(country: { name: string; code: string; codeIso3: string; createdAt: Date; updatedAt: Date | null }): CountryDto {
    return {
      name: country.name,
      code: country.code,
      codeIso3: country.codeIso3,
      createdAt: country.createdAt,
      updatedAt: country.updatedAt,
    };
  }

  async getAllCountries(): Promise<CountryListResponse> {
    const [countries, total] = await Promise.all([
      this.countryRepository.findAll(),
      this.countryRepository.count(),
    ]);

    return {
      countries: countries.map(this.mapToDto),
      total,
    };
  }

  async getCountryByCode(code: string): Promise<CountryDto | null> {
    const country = await this.countryRepository.findByCode(code);
    if (!country) return null;
    return this.mapToDto(country);
  }

  async getCountryByCodeIso3(codeIso3: string): Promise<CountryDto | null> {
    const country = await this.countryRepository.findByCodeIso3(codeIso3);
    if (!country) return null;
    return this.mapToDto(country);
  }
}
