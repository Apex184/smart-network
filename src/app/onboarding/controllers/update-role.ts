import { addMinutes } from 'date-fns';
import { RequestHandler } from 'express';
import { databaseTransaction, generateRandomString, hash, logger, ResponseMessage } from '@/lib';
import { sendVerificationEmail } from '@/lib/emails';
import { User, UserRole } from '@/lib/models';
import { UserRepository, VerificationTokenRepository } from '@/lib/repositories';

import { UpdateUserRoleSchema } from '../validations';

export const updateRoleController: RequestHandler<{ userId: number }, any, UpdateUserRoleSchema, any, { user: User }> = async (req, res) => {
    const { role, userId } = req.body;

    const user = res.locals.user;
    const userRepo = new UserRepository();

    // await userRepo.update(user.id, role);


    // let user = await userRepo.findByEmail(email);
    // logger.info(`User not found`, user)
    // const isNewUser = !user || !user?.emailVerified;
    // logger.info(isNewUser)
    // logger.info(role)
    // const hashedPassword = await hash(password);
    // logger.info(hashedPassword);
    // return;
    // await databaseTransaction(async (t) => {
    //     user ??= await userRepo.create({
    //         email,
    //         role,
    //         createdAt: Date.now(),
    //         updatedAt: Date.now(),
    //     }, { transaction: t });

    //     const updateToken = tokenRepo.updateOrCreate(
    //         { email, token: await hash(token), expires: addMinutes(new Date(), 10) },
    //         { transaction: t },
    //     );

    //     // Handle role-specific actions after user creation
    //     if (role === UserRole.ADMIN) {
    //         // Grant admin privileges, send admin-specific email, etc.
    //     } else if (role === UserRole.ORGANIZER) {
    //         // Grant organizer privileges, send organizer-specific email, etc.
    //     } else {
    //         // Default actions for regular users
    //     }

    //     await Promise.all([updateToken, ...(user.admin ? [] : [user.createAdmin({}, { transaction: t })])]);
    // });

    // isNewUser &&
    //     sendVerificationEmail(email, token).catch((err) => {
    //         logger.error(err, 'Failed to send verification email');
    //     });

    // return res.status(200).json({
    //     success: true,
    //     message: isNewUser ? ResponseMessage.VerificationEmailSent : ResponseMessage.AdminSignupSuccess,
    //     data: {
    //         email,
    //         // Other user details
    //     },
    // });
};