import { z } from 'zod';

// Base entity schema
export const baseEntitySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
});

// Paginated response schema factory
export const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    count: z.number().int().nonnegative(),
    next: z.string().url().nullable(),
    previous: z.string().url().nullable(),
    results: z.array(itemSchema),
  });

export type BaseEntity = z.infer<typeof baseEntitySchema>;

export * from './pokemon.schema';
