import { z } from 'zod';
import { UserRole } from '@/lib/models';

export const UpdateUserRoleSchema = z.object({
    userId: z.number().int().positive('User ID must be a positive integer'),
    role: z.nativeEnum(UserRole),
});

export type UpdateUserRoleSchema = z.TypeOf<typeof UpdateUserRoleSchema>;