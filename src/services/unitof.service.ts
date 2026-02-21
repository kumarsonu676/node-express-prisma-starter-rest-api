import container from '../config/ioc.config';
import { TYPES } from '../config/ioc.types';
import { CountryService } from './country.service';

export default class UnitOfService {
  public Country: CountryService;

  constructor(country = container.get<CountryService>(TYPES.CountryService)) {
    this.Country = country;
  }
}
