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


// import { RequestHandler } from 'express';

// import { verifyJWT } from '@/lib';

// import { AuthenticationError } from '../errors';
// import { User } from '../models';
// import { UserRepository } from '../repositories';

// export const authenticate: RequestHandler = async (req, res, next) => {
//     const token = req.cookies.token ?? req.headers.authorization?.replace('Bearer ', '');

//     if (!token) {
//         throw new AuthenticationError();
//     }

//     try {
//         const decoded = (await verifyJWT(token)) as {
//             userId: string;
//         };

//         res.locals.token = decoded;

//         const userRepo = new UserRepository();
//         const user = await userRepo.findByPk(decoded.userId, {
//             include: [User.associations.Admin],
//         });

//         if (!user) {
//             throw new AuthenticationError();
//         }

//         res.locals.user = user;
//     } catch (error) {
//         throw new AuthenticationError();
//     }

//     next();
// };
