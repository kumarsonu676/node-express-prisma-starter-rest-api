import { injectable } from 'inversify';
import container from '../config/ioc.config';
import { TYPES } from '../config/ioc.types';
import { PrismaService } from '../services/prisma.service';

@injectable()
export class CountryRepository {
  constructor(private prisma = container.get<PrismaService>(TYPES.PrismaService)) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.country.findMany();
  }
}
