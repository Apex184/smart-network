import { Request, Response } from 'express';
import { RequestHandler } from 'express';

import { ErrorMessage, ResponseMessage, signJWT } from '@/lib';
import { BadRequestError, NotFoundError } from '@/lib/errors';
import { addMinutes } from 'date-fns';
import { OAuth2Client } from 'google-auth-library';
import { databaseTransaction, generateRandomString, hash, logger } from '@/lib';
import { env } from '@/lib/config';
import { UserRepository, VerificationTokenRepository } from '@/lib/repositories';


const client = new OAuth2Client(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.GOOGLE_REDIRECT
);

export const googleAuthUrl = (req: Request, res: Response) => {
    const authUrl = client.generateAuthUrl({
        access_type: 'offline',
        scope: ['profile', 'email'],
    });
    return res.redirect(authUrl);
};

// export const googleCallback = async (req: Request, res: Response) => {
//     try {
//         const { code } = req.query;

//         const { tokens } = await client.getToken(code as string);
//         client.setCredentials(tokens);

//         const ticket = await client.verifyIdToken({
//             idToken: tokens.id_token as string,
//             audience: process.env.GOOGLE_CLIENT_ID,
//         });

//         const payload = ticket.getPayload();
//         if (!payload) {
//             return res.status(400).json({ message: 'Invalid ID token' });
//         }

//         const { sub: googleId, email, name, picture } = payload;
//         const providerId = googleId;
//         const userRepo = new UserRepository();
//         const tokenRepo = new VerificationTokenRepository();
//         const token = generateRandomString(6, { type: 'alphanumericUpper' });

//         if (!email) {
//             return res.status(400).json({
//                 message: 'Email address is required but was not provided by Google.',
//             });
//         }

//         let user = await userRepo.findByGoogleId(providerId) || await userRepo.findByEmail(email);

//         await databaseTransaction(async (t) => {
//             if (!user) {
//                 await userRepo.create({
//                     providerId: googleId,
//                     provider: 'google',
//                     email,
//                     fullName: name,
//                     image: picture,
//                     emailVerified: new Date(),
//                 }, { transaction: t });

//                 const updateToken = tokenRepo.updateOrCreate(
//                     { email, token: await hash(token), expires: addMinutes(new Date(), 10) },
//                     { transaction: t },
//                 );

//                 await Promise.all([updateToken, { transaction: t }]);
//                 const validToken = await tokenRepo.compareToken(token, email);

//                 if (!validToken) throw new BadRequestError(ErrorMessage.InvalidToken);
//                 else if (validToken.expires < new Date()) {
//                     throw new BadRequestError(ErrorMessage.TokenExpired);
//                 } else if (!validToken.user) throw new NotFoundError('That email');

//                 if (!validToken.user.emailVerified) {
//                     await validToken.user.update({ emailVerified: new Date() });
//                 }

//                 const user = await validToken.user.reload();

//                 tokenRepo.deleteByEmail(email);

//                 const authToken = await signJWT({ userId: validToken.user.id });
//                 res.cookie('token', authToken, { httpOnly: true });

//                 return res.status(200).json({
//                     message: 'User signed up successfully. Please update your role.',
//                     userId: user.id,
//                     actionRequired: 'updateRole'
//                 });
//             }
//         });

//         res.status(200).json({
//             message: 'User signed in successfully',
//             userId: user?.id,
//         });

//     } catch (error) {
//         console.error('Google callback error:', error);
//         return res.status(500).json({ message: 'Internal Server Error', error: error instanceof Error ? error.message : error });
//     }
// };


export const googleCallback = async (req: Request, res: Response) => {
    try {
        const { code } = req.query;

        // Step 1: Authenticate the user with Google
        const { tokens } = await client.getToken(code as string);
        client.setCredentials(tokens);

        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token as string,
            audience: env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) return res.status(400).json({ message: 'Invalid ID token' });

        const { sub: googleId, email, name, picture } = payload;
        const userRepo = new UserRepository();
        const tokenRepo = new VerificationTokenRepository();
        const token = generateRandomString(6, { type: 'alphanumericUpper' });

        if (!email) return res.status(400).json({ message: 'Email is required but missing from Google response.' });

        let userFind = await userRepo.findByGoogleId(googleId) || await userRepo.findByEmail(email);
        let newUser = false;
        let userAuth;

        await databaseTransaction(async (t) => {
            if (!userFind) {
                newUser = true;
                userFind = await userRepo.create({
                    providerId: googleId,
                    provider: 'google',
                    email,
                    fullName: name,
                    image: picture,
                    emailVerified: new Date(),
                }, { transaction: t });

                await tokenRepo.updateOrCreate(
                    { email, token: await hash(token), expires: addMinutes(new Date(), 10) },
                    { transaction: t },
                );

                const validToken = await tokenRepo.compareToken(token, email);
                if (!validToken) throw new BadRequestError('Invalid token');
                if (validToken.expires < new Date()) throw new BadRequestError('Token expired');

                if (!validToken.user?.emailVerified) {
                    await validToken.user?.update({ emailVerified: new Date() }, { transaction: t });
                }

                userAuth = await validToken.user?.reload();
                await tokenRepo.deleteByEmail(email);
            }
        });

        if (newUser) {
            const authToken = await signJWT({ userId: userAuth!.id });
            res.cookie('token', authToken, { httpOnly: true });
            return res.status(200).json({
                message: 'User signed up successfully. Please update your role.',
                userId: userAuth!.id,
                actionRequired: 'updateRole'
            });
        } else {
            return res.status(200).json({
                message: 'User signed in successfully',
                userId: userAuth!.id,
            });
        }

    } catch (error) {
        console.error('Google callback error:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error instanceof Error ? error.message : error });
    }
};
