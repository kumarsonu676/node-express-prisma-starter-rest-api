import { injectable } from 'inversify';
import container from '../../config/ioc.config';
import { TYPES_COMMON } from '../../config/ioc.types';
import { PrismaService } from '../../services/prisma.service';
import { Prisma } from '../../prisma/generated/prisma/client';

@injectable()
export class CountryRepository {
  constructor(
    private prisma = container.get<PrismaService>(TYPES_COMMON.PrismaService)
  ) {}

  async findAll(): Promise<Prisma.CountryGetPayload<{}>[]> {
    return this.prisma.country.findMany();
  }

  async findByCode(code: string): Promise<Prisma.CountryGetPayload<{}> | null> {
    return this.prisma.country.findUnique({ where: { code } });
  }

  async findByCodeIso3(codeIso3: string): Promise<Prisma.CountryGetPayload<{}> | null> {
    return this.prisma.country.findUnique({ where: { codeIso3 } });
  }

  async count(): Promise<number> {
    return this.prisma.country.count();
  }
}
