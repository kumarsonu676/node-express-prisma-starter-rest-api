import { z } from 'zod';

export const countryCodeSchema = z.object({
    code: z.string().min(2, 'Code must be 2 characters long').max(2, 'Code must be 2 characters long'),
});

export const countryCodeIso3Schema = z.object({
    codeIso3: z.string().min(3, 'Code ISO3 must be 3 characters long').max(3, 'Code ISO3 must be 3 characters long'),
});
