import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

const appConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || "",
    audience: process.env.JWT_AUDIENCE || "",
    issuer: process.env.JWT_ISSUER || "",
  },
  environment: process.env.NODE_ENV || "development",
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3001,
  api: {
    clientId: process.env.CLIENT_ID || "",
  },
  app: {
    name: process.env.APP_NAME || "Cricko API",
    version: process.env.APP_VERSION || "1.0.0",
    mode: process.env.APP_MODE || "local",
    description:
      process.env.APP_DESCRIPTION ||
      "Cricko API for cricket match data management",
    author: process.env.APP_AUTHOR || "Cricko API",
    url: process.env.APP_URL || "http://localhost:3000",
  },
  database: {
    url: process.env.DATABASE_URL || "",
  },
  azureStorage: {
    connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING || "",
    containerName: process.env.AZURE_STORAGE_CONTAINER_NAME || "",
    defaultDomain: process.env.AZURE_STORAGE_DEFAULT_BASE_URL || "",
    assignedDomain: process.env.AZURE_STORAGE_ASSIGNED_BASE_URL || "",
  },
  email: {
    fromName: process.env.SMTP_FROM_NAME || "",
    fromEmail: process.env.SMTP_FROM_EMAIL || "",
    replyToName: process.env.SMTP_REPLY_TO_NAME || "",
    replyToEmail: process.env.SMTP_REPLY_TO_EMAIL || "",
    developerEmail: process.env.DEVELOPER_EMAIL || "",
  },
  smtp: {
    host: process.env.SMTP_HOST || "",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    username: process.env.SMTP_USERNAME || "",
    password: process.env.SMTP_PASSWORD || "",
  },
};

export default appConfig;
