import { Request, Response } from 'express';
import { RequestHandler } from 'express';

import { ErrorMessage, ResponseMessage, signJWT, verifyJWT } from '@/lib';
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


export const googleCallback = async (req: Request, res: Response) => {
    try {
        const { code } = req.query;

        const existingToken = req.cookies?.token || req.headers.authorization?.split(' ')[1];

        let userIdFromToken = null;
        if (existingToken) {
            try {
                const decodedToken = await verifyJWT(existingToken);
                userIdFromToken = (decodedToken as any).userId;
            } catch (err: any) {
                console.warn('JWT verification failed or expired:', err.message);
            }
        }

        if (userIdFromToken) {
            return res.status(200).json({
                message: 'User already signed in',
                userId: userIdFromToken,
            });
        }

        const { tokens } = await client.getToken(code as string);
        client.setCredentials(tokens);

        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token as string,
            audience: env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) return res.status(400).json({ message: 'Invalid ID token' });

        const { sub: googleId, email, name, picture } = payload;
        const providerId = googleId;
        const userRepo = new UserRepository();
        const tokenRepo = new VerificationTokenRepository();
        const token = generateRandomString(6, { type: 'alphanumericUpper' });

        if (!email) return res.status(400).json({ message: 'Email is required but missing from Google response.' });

        let user = await userRepo.findByGoogleId(providerId) || await userRepo.findByEmail(email);
        let newUser = false;


        await databaseTransaction(async (t) => {
            if (!user) {
                newUser = true;
                user = await userRepo.create({
                    providerId: googleId,
                    provider: 'google',
                    email,
                    fullName: name,
                    image: picture,
                }, { transaction: t });


            }
        });
        await databaseTransaction(async (t) => {
            await tokenRepo.updateOrCreate(
                { email, token: await hash(token), expires: addMinutes(new Date(), 10) },
                { transaction: t },
            );
        });

        const validToken = await tokenRepo.compareToken(token, email);
        if (!validToken) {
            throw new BadRequestError('Invalid token');
        }
        if (validToken.expires < new Date()) {
            throw new BadRequestError('Token expired');
        }

        if (!validToken.user?.emailVerified) {
            await validToken.user?.update({ emailVerified: new Date() });
        }

        await validToken.user?.reload();
        await tokenRepo.deleteByEmail(email);

        const authToken = await signJWT({ userId: validToken.user!.id });
        res.cookie('token', authToken, { httpOnly: true });

        if (newUser) {
            return res.status(200).json({
                message: 'User signed up successfully. Please update your role.',
                userId: validToken.user!.id,
                actionRequired: 'updateRole'
            });
        } else {
            return res.status(200).json({
                message: 'User signed in successfully',
                userId: validToken.user!.id,
            });
        }

    } catch (error) {
        console.error('Google callback error:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error instanceof Error ? error.message : error });
    }
};
