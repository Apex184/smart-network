import { RequestHandler } from 'express';
import { verifyJWT } from '@/lib';
import { AuthenticationError } from '../errors';
import { User, UserRole } from '../models';

export const authenticate: RequestHandler = async (req, res, next) => {
    try {
        const token = req.cookies.token ?? req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return next(new AuthenticationError('No token provided.'));
        }

        const decoded = (await verifyJWT(token)) as { userId: string; role: UserRole };

        if (!decoded?.userId || !decoded?.role) {
            return next(new AuthenticationError('Token is invalid or missing user ID and role.'));
        }

        const user = await User.findByPk(decoded.userId);

        if (!user) {
            return next(new AuthenticationError('User not found or unauthorized.'));
        }

        res.locals.token = decoded;
        res.locals.user = {
            id: user.id,
            role: decoded.role,
            email: user.email,

        };

        next();
    } catch (error) {
        next(new AuthenticationError('Invalid token or user is not authorized.'));
    }
};
