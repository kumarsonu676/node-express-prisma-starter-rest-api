import { injectable } from 'inversify';
import { Prisma } from '../../prisma/generated/prisma/client';
import container from '../../config/ioc.config';
import { TYPES_COUNTRY } from '../../config/ioc.types';
import { CountryRepository } from './country.repository';
import type { CountryDto, CountryListResponse } from './country.types';

@injectable()
export class CountryService {
  constructor(
    private countryRepository = container.get<CountryRepository>(TYPES_COUNTRY.CountryRepository)
  ) {}

  private toDto(country: Prisma.CountryGetPayload<{}>): CountryDto {
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

    return { countries: countries.map(this.toDto), total };
  }

  async getCountryByCode(code: string): Promise<CountryDto | null> {
    const country = await this.countryRepository.findByCode(code);
    return country ? this.toDto(country) : null;
  }

  async getCountryByCodeIso3(codeIso3: string): Promise<CountryDto | null> {
    const country = await this.countryRepository.findByCodeIso3(codeIso3);
    return country ? this.toDto(country) : null;
  }
}
