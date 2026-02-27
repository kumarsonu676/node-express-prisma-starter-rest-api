import { Request, Response } from 'express';
import container from '../../config/ioc.config';
import { TYPES_COUNTRY } from '../../config/ioc.types';
import { CountryService } from './country.service';
import { ok } from '../../utils/api-response';
import { asyncHandler } from '../../utils/asyncHandler';
import type { CountryDto, CountryListResponse } from './country.types';

export class CountryController {
  constructor(private countryService = container.get<CountryService>(TYPES_COUNTRY.CountryService)) {
    this.countryService = countryService;
  }

  public getAllCountries = asyncHandler(async (req: Request, res: Response) => {
    const result: CountryListResponse = await this.countryService.getAllCountries();
    return ok(req, res, result);
  });

  public getCountryByCode = asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.params;
    const country: CountryDto | null = await this.countryService.getCountryByCode(code as string);
    return ok(req, res, country);
  });

  public getCountryByCodeIso3 = asyncHandler(async (req: Request, res: Response) => {
    const { codeIso3 } = req.params;
    const country: CountryDto | null = await this.countryService.getCountryByCodeIso3(codeIso3 as string);
    return ok(req, res, country);
  });
}
