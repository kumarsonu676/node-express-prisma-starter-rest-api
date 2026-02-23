import dotenv from "dotenv";
import { validateEnv, Env } from "./env.schema";

dotenv.config();
dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

const env = validateEnv();

const appConfig = {
    env,
    jwt: {
        secret: env.JWT_SECRET,
        audience: env.JWT_AUDIENCE,
        issuer: env.JWT_ISSUER,
        expiresIn: env.JWT_EXPIRES_IN,
        refreshSecret: env.JWT_REFRESH_SECRET,
        refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
    },
    environment: env.NODE_ENV,
    port: parseInt(env.PORT, 10),
    api: {
        clientId: env.CLIENT_ID,
    },
    app: {
        name: env.APP_NAME,
        version: env.APP_VERSION,
        mode: env.APP_MODE,
        description: env.APP_DESCRIPTION,
        author: env.APP_AUTHOR,
        url: env.APP_URL,
    },
    database: {
        url: env.DATABASE_URL,
    },
    azureStorage: {
        connectionString: env.AZURE_STORAGE_CONNECTION_STRING,
        containerName: env.AZURE_STORAGE_CONTAINER_NAME,
        defaultDomain: env.AZURE_STORAGE_DEFAULT_BASE_URL,
        assignedDomain: env.AZURE_STORAGE_ASSIGNED_BASE_URL,
    },
    email: {
        fromName: env.SMTP_FROM_NAME,
        fromEmail: env.SMTP_FROM_EMAIL,
        replyToName: env.SMTP_REPLY_TO_NAME,
        replyToEmail: env.SMTP_REPLY_TO_EMAIL,
        developerEmail: env.DEVELOPER_EMAIL,
    },
    smtp: {
        host: env.SMTP_HOST,
        port: parseInt(env.SMTP_PORT, 10),
        username: env.SMTP_USERNAME,
        password: env.SMTP_PASSWORD,
    },
    cors: {
        origin: env.CORS_ORIGIN,
    },
};

export default appConfig;
