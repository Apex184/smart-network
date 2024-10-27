import { RequestHandler } from 'express';
import { AuthenticationError } from '../errors';
import { UserRole } from '../models';

export const authorizeRoles = (...roles: UserRole[]): RequestHandler => {
    return (req, res, next) => {
        const user = res.locals.user;

        if (!user) {
            return next(new AuthenticationError('User is not authenticated.'));
        }

        if (!roles.includes(user.role)) {
            return res.status(403).json({ message: 'Access forbidden: insufficient privileges' });
        }

        next();
    };
};
