import pino, { TransportMultiOptions, TransportTargetOptions } from 'pino';
import { createWriteStream } from 'pino-sentry';

import { env, isProd, isStaging } from '@/lib/config';

const targets: TransportTargetOptions[] = [
  {
    target: 'pino-pretty',
    options: {
      ignore: 'pid,hostname',
      translateTime: 'SYS:standard',
    },
  },
];

if (isProd || isStaging) {
  targets.push({
    target: 'pino-sentry-transport',
    options: {
      sentry: {
        dsn: env.SENTRY_DSN,
      },
      withLogRecord: true, // default false - send the log record to sentry as a context.(if its more then 8Kb Sentry will throw an error)
      tags: ['id'], // sentry tags to add to the event, uses lodash.get to get the value from the log record
      context: ['hostname'], // sentry context to add to the event, uses lodash.get to get the value from the log record,
      minLevel: 10, // which level to send to sentry
      skipSentryInitialization: true, // default false - if you want to initialize sentry by yourself
    },
  });
}

const transport: TransportMultiOptions = { targets };

export const logger = pino(
  {
    transport,
    redact: {
      paths: [
        'headers.authorization',
        'headers.Authorization',
        'headers.cookie',
        'headers["set-cookie"]',
        'headers["Set-Cookie"]',
        'headers.referer',
        'headers["X-Forwarded-For"]',
        'headers["x-forwarded-for"]',
        'password',
        'secret',
        'token',
        'refreshToken',
        'accessToken',
        'JWT_SECRET',
        'DATABASE_URL',
      ],
    },
  },
  isProd || isStaging
    ? createWriteStream({
      dsn: env.SENTRY_DSN,
      enableTracing: true,
      attachStacktrace: true,
      level: 'info',
    })
    : undefined,
);
