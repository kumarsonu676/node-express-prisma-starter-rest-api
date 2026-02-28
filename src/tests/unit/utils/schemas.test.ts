import { z } from "zod";
import {
    emailSchema,
    passwordSchema,
    paginationSchema,
    uuidSchema,
    idParamSchema,
} from "../../../utils/schemas/common.schema";

describe("Common Schemas", () => {
    describe("emailSchema", () => {
        it("should validate correct email", () => {
            const result = emailSchema.safeParse("test@example.com");
            expect(result.success).toBe(true);
            expect(result.data).toBe("test@example.com");
        });

        it("should transform email to lowercase", () => {
            const result = emailSchema.safeParse("TEST@Example.COM");
            expect(result.success).toBe(true);
            expect(result.data).toBe("test@example.com");
        });

        it("should reject invalid email", () => {
            const result = emailSchema.safeParse("invalid-email");
            expect(result.success).toBe(false);
        });
    });

    describe("passwordSchema", () => {
        it("should validate correct password", () => {
            const result = passwordSchema.safeParse("Password123");
            expect(result.success).toBe(true);
        });

        it("should reject short password", () => {
            const result = passwordSchema.safeParse("Pass1");
            expect(result.success).toBe(false);
        });

        it("should reject password without uppercase", () => {
            const result = passwordSchema.safeParse("password123");
            expect(result.success).toBe(false);
        });

        it("should reject password without lowercase", () => {
            const result = passwordSchema.safeParse("PASSWORD123");
            expect(result.success).toBe(false);
        });

        it("should reject password without number", () => {
            const result = passwordSchema.safeParse("PasswordAbc");
            expect(result.success).toBe(false);
        });
    });

    describe("paginationSchema", () => {
        it("should validate default pagination", () => {
            const result = paginationSchema.safeParse({});
            expect(result.success).toBe(true);
            expect(result.data).toEqual({ page: 1, limit: 10 });
        });

        it("should parse string numbers", () => {
            const result = paginationSchema.safeParse({ page: "2", limit: "20" });
            expect(result.success).toBe(true);
            expect(result.data).toEqual({ page: 2, limit: 20 });
        });

        it("should reject negative page", () => {
            const result = paginationSchema.safeParse({ page: -1 });
            expect(result.success).toBe(false);
        });

        it("should reject limit over 100", () => {
            const result = paginationSchema.safeParse({ limit: 101 });
            expect(result.success).toBe(false);
        });
    });

    describe("uuidSchema", () => {
        it("should validate correct UUID", () => {
            const result = uuidSchema.safeParse("550e8400-e29b-41d4-a716-446655440000");
            expect(result.success).toBe(true);
        });

        it("should reject invalid UUID", () => {
            const result = uuidSchema.safeParse("not-a-uuid");
            expect(result.success).toBe(false);
        });
    });

    describe("idParamSchema", () => {
        it("should validate correct id param", () => {
            const result = idParamSchema.safeParse({ id: "550e8400-e29b-41d4-a716-446655440000" });
            expect(result.success).toBe(true);
        });

        it("should reject invalid id param", () => {
            const result = idParamSchema.safeParse({ id: "invalid" });
            expect(result.success).toBe(false);
        });

        it("should reject missing id", () => {
            const result = idParamSchema.safeParse({});
            expect(result.success).toBe(false);
        });
    });
});
