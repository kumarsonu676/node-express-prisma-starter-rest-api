import dotenv, { config } from "dotenv";

dotenv.config();
dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

const appConfig = {
  app: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || "localhost",
  },
  environment: process.env.NODE_ENV || "development",
  jwt: {
    secret: process.env.JWT_SECRET || "",
    audience: process.env.JWT_AUDIENCE || "",
    issuer: process.env.JWT_ISSUER || "",
  },
  db: {
    url: process.env.DATABASE_URL || "",
  },
};

export default appConfig;
