import { z } from 'zod';

export const uuidSchema = z.string().uuid('Invalid UUID format');

export const emailSchema = z
  .string()
  .email('Invalid email format')
  .transform((val) => val.toLowerCase().trim());

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const paginationSchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
  })
  .strict();

export const idParamSchema = z
  .object({
    id: uuidSchema,
  })
  .strict();

export const booleanSchema = z.coerce.boolean().transform((val) => Boolean(val));

export const sortOrderSchema = z.enum(['asc', 'desc']).default('desc');

export const searchSchema = z.string().max(100, 'Search query too long').optional();

export const dateRangeSchema = z
  .object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }
      return true;
    },
    { message: 'startDate must be before endDate' }
  );

export const isoDateSchema = z.string().datetime('Invalid ISO date format');

export const urlSchema = z.string().url('Invalid URL format').optional();

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
  .optional();

export const paginationResult = (page: number, limit: number, total: number) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
  hasNext: page * limit < total,
  hasPrev: page > 1,
});
