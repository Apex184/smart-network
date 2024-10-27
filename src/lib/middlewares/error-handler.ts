import { ErrorRequestHandler } from 'express';

import { ErrorMessage, logger } from '@/lib';
import { HttpError } from '@/lib/errors';

import { isDev, isProd } from '../config';

interface ValidationError extends Error {
  errors: {
    [key: string]: { message: string };
  };
}

export const errorHandler: ErrorRequestHandler = (error: Error, _req, res, _next) => {
  logger.error(error);

  if (error.name === 'ValidationError') {
    const mongooseError = error as ValidationError;
    return res.status(400).send({
      success: false,
      message: 'Validation error',
      errors: Object.values(mongooseError.errors).map((err: any) => err.message),
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).send({
      success: false,
      message: 'Invalid request',
    });
  }

  if (error instanceof HttpError) {
    return res.status(error.statusCode).send(error.serializeError());
  }

  return res.status(isProd ? 500 : 400).send({
    success: false,
    message: isProd ? ErrorMessage.ServerError : 'Development Server Error',
    error: isDev ? { ...error, stack: error.stack } : null,
  });
};

