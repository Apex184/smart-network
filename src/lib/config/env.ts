import { z } from 'zod';

import { logger } from '@/lib';

const envSchema = z
    .object({
        NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
        PORT: z.coerce.number().default(3001),
        JWT_SECRET: z.string().default('secret'),
        DATABASE_URL: z.string().url({ message: 'Invalid database URL' }),
        DATABASE_MAX_POOL: z.coerce.number().min(0).default(5),
        DATABASE_MIN_POOL: z.coerce.number().min(0).default(1),
        SHOW_DATABASE_QUERIES: z.coerce.boolean().default(false),
        SENTRY_DSN: z.string().url({ message: 'Invalid Sentry DSN' }).optional(),
        RESEND_API_KEY: z.string(),
        GOOGLE_CLIENT_ID: z.string(),
        GOOGLE_CLIENT_SECRET: z.string(),
        GOOGLE_REDIRECT: z.string(),
        RESEND_FROM_EMAIL: z.string().email({ message: 'Invalid email' }).toLowerCase(),
        CLOUDINARY_SECRET: z.string().min(1, 'Cloudinary secret is required').optional(),
        CLOUDINARY_API_KEY: z.string().min(1, 'Cloudinary API key is required').optional(),
        CLOUDINARY_CLOUD_NAME: z.string().min(1, 'Cloudinary cloud name is required').optional(),
        CLOUDINARY_UPLOAD_PRESET: z.string().min(1, 'Cloudinary upload preset is required').optional(),
        CLOUDINARY_PROFILE_PICS_FOLDER: z.string().min(1, 'Cloudinary profile pics folder is required').optional(),
    })
    .refine((env) => env.DATABASE_MAX_POOL >= env.DATABASE_MIN_POOL, {
        message: 'DATABASE_MAX_POOL must be greater than DATABASE_MIN_POOL',
        path: ['DATABASE_MAX_POOL', 'DATABASE_MIN_POOL'],
    })
    .refine((env) => ['development', 'test'].includes(env.NODE_ENV) || env.SENTRY_DSN, {
        message: 'Sentry DSN is required in production or staging environment',
        path: ['SENTRY_DSN'],
    })
    .refine((env) => ['test'].includes(env.NODE_ENV) || env.CLOUDINARY_SECRET, {
        message: 'Cloudinary secret is required',
        path: ['CLOUDINARY_SECRET'],
    })
    .refine((env) => ['test'].includes(env.NODE_ENV) || env.CLOUDINARY_API_KEY, {
        message: 'Cloudinary API key is required',
        path: ['CLOUDINARY_API_KEY'],
    })
    .refine((env) => ['test'].includes(env.NODE_ENV) || env.CLOUDINARY_CLOUD_NAME, {
        message: 'Cloudinary cloud name is required',
        path: ['CLOUDINARY_CLOUD_NAME'],
    })
    .refine((env) => ['test'].includes(env.NODE_ENV) || env.CLOUDINARY_UPLOAD_PRESET, {
        message: 'Cloudinary upload preset is required',
        path: ['CLOUDINARY_UPLOAD_PRESET'],
    })
    .refine((env) => ['test'].includes(env.NODE_ENV) || env.CLOUDINARY_PROFILE_PICS_FOLDER, {
        message: 'Cloudinary profile pics folder is required',
        path: ['CLOUDINARY_PROFILE_PICS_FOLDER'],
    });

type Env = z.infer<typeof envSchema>;

export function assertEnv(env: unknown): asserts env is Env {
    try {
        envSchema.parse(env);
        logger.info('Environment variables loaded!');
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error('Invalid environment variables', { cause: error.flatten().fieldErrors });
        }
    }
}

assertEnv(process.env);

export const env = envSchema.parse(process.env);

export const isDev = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';
export const isStaging = env.NODE_ENV === 'staging';
export const isProd = env.NODE_ENV === 'production';
