import { PrismaClient, Prisma } from '../prisma/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { injectable } from 'inversify';
import appConfig from '../config/app.config';

@injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      adapter: new PrismaPg({
        connectionString: appConfig.database.url,
      }),

      log: appConfig.environment === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],

      transactionOptions: {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000,
        timeout: 10000,
      },
    });
  }
}
