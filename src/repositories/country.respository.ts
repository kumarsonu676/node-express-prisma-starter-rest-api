import { injectable } from 'inversify';
import container from '../config/ioc.config';
import { TYPES } from '../config/ioc.types';
import { PrismaService } from '../services/prisma.service';

@injectable()
export class CountryRepository {
  constructor(private prismaService = container.get<PrismaService>(TYPES.PrismaService)) {
    this.prismaService = prismaService;
  }

  async findAll() {
    return this.prismaService.country.findMany();
  }
}
