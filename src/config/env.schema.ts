import { z } from "zod";

export const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.string().default("3001"),
    APP_NAME: z.string().default("Cricko API"),
    APP_VERSION: z.string().default("1.0.0"),
    APP_DESCRIPTION: z.string().optional(),
    APP_MODE: z.string().default("local"),
    APP_AUTHOR: z.string().optional(),
    APP_URL: z.string().optional(),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
    JWT_EXPIRES_IN: z.string().default("1d"),
    JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
    JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
    JWT_AUDIENCE: z.string().optional(),
    JWT_ISSUER: z.string().optional(),
    CLIENT_ID: z.string().optional(),
    AZURE_STORAGE_CONNECTION_STRING: z.string().optional(),
    AZURE_STORAGE_CONTAINER_NAME: z.string().optional(),
    AZURE_STORAGE_DEFAULT_BASE_URL: z.string().optional(),
    AZURE_STORAGE_ASSIGNED_BASE_URL: z.string().optional(),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.string().default("587"),
    SMTP_USERNAME: z.string().optional(),
    SMTP_PASSWORD: z.string().optional(),
    SMTP_FROM_NAME: z.string().optional(),
    SMTP_FROM_EMAIL: z.string().email().optional(),
    SMTP_REPLY_TO_NAME: z.string().optional(),
    SMTP_REPLY_TO_EMAIL: z.string().email().optional(),
    DEVELOPER_EMAIL: z.string().email().optional(),
    CORS_ORIGIN: z.string().default("*"),
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export const validateEnv = (): Env => {
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
        console.error("Invalid environment variables:");
        result.error.issues.forEach((issue) => {
            console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
        });
        process.exit(1);
    }

    return result.data;
};
