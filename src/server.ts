import app from "./app";
import appConfig from "./config/app.config";
import container from "./config/ioc.config";
import { TYPES } from "./config/ioc.types";
import { PrismaService } from "./services/prisma.service";
import { logger } from "./utils/logger";

const PORT = appConfig.port || 3001;

const prismaService = container.get<PrismaService>(TYPES.PrismaService);

const gracefulShutdown = async (signal: string): Promise<void> => {
    logger.info(`${signal} received. Starting graceful shutdown...`);
    try {
        await prismaService.$disconnect();
        logger.info("Database connections closed");
        process.exit(0);
    } catch (error) {
        logger.error("Error during shutdown", { error });
        process.exit(1);
    }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

process.on("uncaughtException", (error: Error) => {
    logger.error("Uncaught Exception", {
        error: error.message,
        stack: error.stack,
    });
    process.exit(1);
});

process.on("unhandledRejection", (reason: unknown) => {
    logger.error("Unhandled Rejection", {
        reason,
    });
    process.exit(1);
});

app.listen(PORT, () => {
    logger.info(`Server is running on port http://localhost:${PORT}`);
});
