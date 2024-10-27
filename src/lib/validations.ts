import { z } from 'zod';

export const PaginationSchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(25),
    page: z.coerce.number().int().min(1).default(1),
});

export const SortableSchema = z.object({
    sort: z
        .string()
        .regex(/(?:-?\w+)(?:,(?:-?\w+)*)+/)
        .optional(),
    fields: z
        .string()
        .regex(/(?:-?\w+)(?:,(?:-?\w+)*)+/)
        .optional(),
});

export type PaginationSchema = z.TypeOf<typeof PaginationSchema>;
export type SortableSchema = z.TypeOf<typeof SortableSchema>;
