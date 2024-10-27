import pinoHttp from 'pino-http';

import { logger } from '../logger';

export const httpLogger = pinoHttp({
  quietReqLogger: true,
  base: logger,

  customLogLevel: function (req, res, err) {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn';
    } else if (res.statusCode >= 500 || err) {
      return 'error';
    } else if (res.statusCode >= 300 && res.statusCode < 400) {
      return 'silent';
    }
    return 'info';
  },

  transport: {
    target: 'pino-http-print',
    options: {
      all: true,
      translateTime: 'SYS:standard',
      relativeUrl: true,
    },
  },

  redact: {
    paths: [
      'headers.authorization',
      'headers.cookie',
      'headers["Set-Cookie"]',
      'headers["set-cookie"]',
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
});
