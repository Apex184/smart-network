import { RequestHandler } from 'express';

import { ErrorMessage } from '../constants';
import { AuthorizationError } from '../errors';

export const emailVerified: RequestHandler = async (req, res, next) => {
    const { emailVerified } = res.locals.user;
    if (!emailVerified) {
        throw new AuthorizationError(ErrorMessage.EmailNotVerified);
    }

    next();
};
