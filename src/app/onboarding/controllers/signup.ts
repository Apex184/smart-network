import { addMinutes } from 'date-fns';
import { RequestHandler } from 'express';
import { databaseTransaction, generateRandomString, hash, logger, ResponseMessage } from '@/lib';
import { sendVerificationEmail } from '@/lib/emails';
import { User, UserRole } from '@/lib/models';
import { UserRepository, VerificationTokenRepository } from '@/lib/repositories';

import { SignUpSchema } from '../validations';

export const signUpController: RequestHandler<any, any, SignUpSchema> = async (req, res) => {
    const { email, role, password } = req.body;
    const userRepo = new UserRepository();
    const tokenRepo = new VerificationTokenRepository();
    const token = generateRandomString(6, { type: 'alphanumericUpper' });

    let user = await userRepo.findByEmail(email, { include: [User.associations.User] });
    const isNewUser = !user || !user?.emailVerified;
    const hashedPassword = await hash(password);
    await databaseTransaction(async (t) => {
        user ??= await userRepo.create({
            email,
            role,
            hashedPassword,
            createdAt: Date.now(),
            updatedAt: undefined,
            // Add default values or role-specific initialization here
        }, { transaction: t });

        const updateToken = tokenRepo.updateOrCreate(
            { email, token: await hash(token), expires: addMinutes(new Date(), 10) },
            { transaction: t },
        );

        // Handle role-specific actions after user creation
        if (role === UserRole.ADMIN) {
            // Grant admin privileges, send admin-specific email, etc.
        } else if (role === UserRole.ORGANIZER) {
            // Grant organizer privileges, send organizer-specific email, etc.
        } else {
            // Default actions for regular users
        }

        await Promise.all([updateToken, ...(user.admin ? [] : [user.createAdmin({}, { transaction: t })])]);
    });

    isNewUser &&
        sendVerificationEmail(email, token).catch((err) => {
            logger.error(err, 'Failed to send verification email');
        });

    return res.status(200).json({
        success: true,
        message: isNewUser ? ResponseMessage.VerificationEmailSent : ResponseMessage.AdminSignupSuccess,
        data: {
            email,
            // Other user details
        },
    });
};