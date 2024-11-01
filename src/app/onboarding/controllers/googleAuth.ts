import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { databaseTransaction } from '@/lib';
import { env } from '@/lib/config';
import { UserRepository } from '@/lib/repositories';


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

        const { tokens } = await client.getToken(code as string);

        client.setCredentials(tokens);

        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token as string,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        console.log('ID token verified:', ticket);

        const payload = ticket.getPayload();
        if (!payload) {
            return res.status(400).json({ message: 'Invalid ID token' });
        }

        const { sub: googleId, email, name, picture } = payload;

        const userRepo = new UserRepository();
        if (!email) {
            return res.status(400).json({
                message: 'Email address is required but was not provided by Google.',
            });
        }

        let user = await userRepo.findByGoogleId(googleId) || await userRepo.findByEmail(email);
        await databaseTransaction(async (t) => {
            user ??= await userRepo.create({
                providerId: googleId, email, fullName: name, image: picture, role: 'user',
            }, { transaction: t });

        });

        res.status(200).json({
            message: user ? 'User signed in successfully' : 'User signed up successfully',
        });
    } catch (error) {
        console.error('Google callback error:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error instanceof Error ? error.message : error });
    }
};

