import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import * as path from "path";
import appConfig from "../config/app.config";

const logDir = path.join(process.cwd(), "logs");

const logFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, stack, ...metadata }) => {
        let msg = `${timestamp} [${level}]: ${message}`;
        if (stack && level === "error") {
            msg += `\n${stack}`;
        }
        if (Object.keys(metadata).length > 0) {
            msg += ` ${JSON.stringify(metadata)}`;
        }
        return msg;
    })
);

const transports: winston.transport[] = [
    new winston.transports.Console({
        format: consoleFormat,
    }),
    new DailyRotateFile({
        filename: path.join(logDir, "error-%DATE%.log"),
        datePattern: "YYYY-MM-DD",
        level: "error",
        maxSize: "20m",
        maxFiles: "14d",
        zippedArchive: true,
    }),
    new DailyRotateFile({
        filename: path.join(logDir, "combined-%DATE%.log"),
        datePattern: "YYYY-MM-DD",
        maxSize: "20m",
        maxFiles: "14d",
        zippedArchive: true,
    }),
];

export const logger = winston.createLogger({
    level: appConfig.environment.isProduction ? "info" : "debug",
    format: logFormat,
    transports,
    exitOnError: false,
});

export const createLogger = (context?: string) => {
    return {
        error: (message: string, meta?: Record<string, unknown>) =>
            logger.error(message, { context, ...meta }),
        warn: (message: string, meta?: Record<string, unknown>) =>
            logger.warn(message, { context, ...meta }),
        info: (message: string, meta?: Record<string, unknown>) =>
            logger.info(message, { context, ...meta }),
        debug: (message: string, meta?: Record<string, unknown>) =>
            logger.debug(message, { context, ...meta }),
    };
};

export default logger;
