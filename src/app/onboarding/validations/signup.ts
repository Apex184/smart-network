import { z } from 'zod';
import { UserRole } from '@/lib/models';
export const SignUpSchema = z.object({
    email: z.string().email('Invalid email').toLowerCase(),
    password: z.string().min(6, 'The minimum for password is 6').toLowerCase(),
    role: z.nativeEnum(UserRole)
    // role: z.literal(UserRole.USER)
    //     .or(z.literal(UserRole.ORGANIZER))
    //     .or(z.literal(UserRole.ADMIN)),

});

export type SignUpSchema = z.TypeOf<typeof SignUpSchema>;
