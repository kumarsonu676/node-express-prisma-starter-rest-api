import {
    AppError,
    PrismaUniqueConstraintError,
    PrismaForeignKeyError,
    PrismaRecordNotFoundError,
    PrismaValidationError,
    InternalServerError,
    ErrorCode,
} from "./errors";
import { logger } from "./logger";

const UNIQUE_CONSTRAINT_ERROR_CODE = "P2002";
const RECORD_NOT_FOUND_ERROR_CODE = "P2025";
const FOREIGN_KEY_CONSTRAINT_ERROR_CODE = "P2003";
const DATA_VALIDATION_ERROR_CODE = "P2012";

interface PrismaKnownError {
    code?: string;
    message: string;
    meta?: Record<string, unknown>;
}

export function handlePrismaError(error: unknown): AppError {
    if (!isPrismaError(error)) {
        return new InternalServerError("An unexpected database error occurred");
    }

    const prismaError = error as PrismaKnownError;

    if (isPrismaKnownRequestError(prismaError)) {
        return handleKnownPrismaError(prismaError);
    }

    if (isPrismaValidationError(error)) {
        const errors = extractValidationErrors(error);
        return new PrismaValidationError("Validation failed", errors);
    }

    if (isPrismaUnknownRequestError(error)) {
        const err = error as { message?: string };
        logger.error("Prisma unknown request error", {
            error: err.message,
        });
        return new InternalServerError("Database operation failed");
    }

    if (isPrismaInitializationError(error)) {
        const err = error as { message?: string };
        logger.error("Prisma initialization error", {
            error: err.message,
        });
        return new InternalServerError("Database connection failed");
    }

    if (isPrismaRustPanicError(error)) {
        const err = error as { message?: string };
        logger.error("Prisma rust panic error", {
            error: err.message,
        });
        return new InternalServerError("Database connection failed", ErrorCode.SERVICE_UNAVAILABLE);
    }

    return new InternalServerError("An unexpected database error occurred");
}

export function isPrismaError(error: unknown): boolean {
    if (!error || typeof error !== "object") return false;
    const errorObj = error as Record<string, unknown>;
    return (
        "code" in errorObj ||
        "message" in errorObj ||
        isPrismaKnownRequestError(error as PrismaKnownError) ||
        isPrismaValidationError(error) ||
        isPrismaUnknownRequestError(error) ||
        isPrismaInitializationError(error) ||
        isPrismaRustPanicError(error)
    );
}

function isPrismaKnownRequestError(error: unknown): boolean {
    if (!error || typeof error !== "object") return false;
    const errorObj = error as Record<string, unknown>;
    return (
        typeof errorObj.code === "string" &&
        ["P2000", "P2001", "P2002", "P2003", "P2004", "P2005", "P2006", "P2007", "P2008", "P2009", "P2010", "P2011", "P2012", "P2013", "P2014", "P2015", "P2016", "P2017", "P2018", "P2019", "P2020", "P2021", "P2022", "P2023", "P2024", "P2025", "P2026", "P2027", "P2030", "P2031", "P2033", "P2034"].includes(errorObj.code as string)
    );
}

function isPrismaValidationError(error: unknown): boolean {
    if (!error || typeof error !== "object") return false;
    const errorObj = error as { name?: string; message?: unknown };
    return Boolean(
        errorObj.name === "PrismaClientValidationError" ||
        (errorObj.message && String(errorObj.message).includes("Invalid `"))
    );
}

function isPrismaUnknownRequestError(error: unknown): boolean {
    if (!error || typeof error !== "object") return false;
    const errorObj = error as { name?: string };
    return errorObj.name === "PrismaClientUnknownRequestError";
}

function isPrismaInitializationError(error: unknown): boolean {
    if (!error || typeof error !== "object") return false;
    const errorObj = error as { name?: string };
    return errorObj.name === "PrismaClientInitializationError";
}

function isPrismaRustPanicError(error: unknown): boolean {
    if (!error || typeof error !== "object") return false;
    const errorObj = error as { name?: string };
    return errorObj.name === "PrismaClientRustPanicError";
}

function handleKnownPrismaError(error: PrismaKnownError): AppError {
    const { code, meta } = error;

    switch (code) {
        case UNIQUE_CONSTRAINT_ERROR_CODE:
            const uniqueField = extractFieldFromMeta(meta);
            return new PrismaUniqueConstraintError(
                `A record with this ${uniqueField || "value"} already exists`
            );

        case RECORD_NOT_FOUND_ERROR_CODE:
            const missingField = extractFieldFromMeta(meta);
            return new PrismaRecordNotFoundError(
                `Record with ${missingField || "criteria"} not found`
            );

        case FOREIGN_KEY_CONSTRAINT_ERROR_CODE:
            const relationField = extractFieldFromMeta(meta);
            return new PrismaForeignKeyError(
                `Referenced record for ${relationField || "field"} does not exist`
            );

        case DATA_VALIDATION_ERROR_CODE:
            return new PrismaValidationError("Data validation failed", [
                { message: error.message, meta }
            ]);

        default:
            logger.error("Unhandled Prisma known error", {
                code,
                message: error.message,
                meta,
            });
            return new InternalServerError("Database operation failed");
    }
}

function extractFieldFromMeta(meta?: Record<string, unknown>): string | undefined {
    const target = meta?.target;
    if (Array.isArray(target) && target.length > 0) {
        return target.join(", ");
    }
    return undefined;
}

function extractValidationErrors(error: unknown): Record<string, unknown>[] {
    try {
        const errorObj = error as Record<string, unknown>;
        const errorMessage = errorObj.message?.toString() || "";
        const pathMatch = errorMessage.match(/Argument `(\w+)`/);
        const field = pathMatch ? pathMatch[1] : "unknown";

        return [
            {
                field,
                message: errorMessage,
            },
        ];
    } catch {
        return [
            {
                field: "unknown",
                message: "Validation error occurred",
            },
        ];
    }
}
