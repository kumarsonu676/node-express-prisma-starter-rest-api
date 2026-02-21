/// <reference path="../types/global.d.ts" />

import { Prisma, PrismaClient } from "../prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import appConfig from "./app.config";

export const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: appConfig.database.url,
  }),
  log:
    appConfig.environment === "development"
      ? ["query", "info", "warn", "error"]
      : ["error"],
  transactionOptions: {
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    maxWait: 5000, // default: 2000
    timeout: 10000, // default: 5000
  },
});
