import { RequestHandler } from 'express';
import { z } from 'zod';

import { RequestValidationError } from '@/lib/errors/request-validation-error';

import { PaginationSchema, SortableSchema } from '..';

export function validate<T extends z.Schema>(
    schema: T,
    options: {
        path?: 'body' | 'query' | 'params';
        canSort?: true;
        canPaginate?: true;
    } = {},
): RequestHandler {
    const { path = 'body', canSort, canPaginate } = options;

    return async (req, res, next) => {
        try {
            const result = await schema.safeParseAsync(req[path]);

            if (!result.success) {
                throw new RequestValidationError(
                    result.error.issues.map((issue) => ({ message: issue.message, path: issue.path })),
                );
            }

            req[path] = result.data;

            if (canSort) {
                const sortResult = await SortableSchema.safeParseAsync(req.query);

                if (!sortResult.success) {
                    throw new RequestValidationError(
                        sortResult.error.issues.map((issue) => ({ message: issue.message, path: issue.path })),
                    );
                }

                res.locals = { ...res.locals, ...sortResult.data };
            }

            if (canPaginate) {
                const paginationResult = await PaginationSchema.safeParseAsync(req.query);

                if (!paginationResult.success) {
                    throw new RequestValidationError(
                        paginationResult.error.issues.map((issue) => ({ message: issue.message, path: issue.path })),
                    );
                }

                res.locals = { ...res.locals, ...paginationResult.data };
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}
