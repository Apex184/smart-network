// import { Request, Response } from 'express';
// import { OAuth2Client } from 'google-auth-library';
// import { generateRandomString, hash, logger, ResponseMessage } from '@/lib';
// import { sendVerificationEmail } from '@/lib/emails';
// import { VerificationTokenRepository, UserRepository } from '@/lib/repositories';
// import { addMinutes } from 'date-fns';
// import jwt from 'jsonwebtoken';
// import { User } from '../../../lib/models';

// const client = new OAuth2Client(
//     process.env.GOOGLE_CLIENT_ID,
//     process.env.GOOGLE_CLIENT_SECRET,
//     process.env.GOOGLE_REDIRECT
// );

// export const googleAuthUrl = (req: Request, res: Response) => {
//     const authUrl = client.generateAuthUrl({
//         access_type: 'offline',
//         scope: ['profile', 'email'],
//     });
//     return res.redirect(authUrl);
// };


// export const googleCallbacks = async (req: Request, res: Response) => {
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
//         const userRepo = new UserRepository();
//         const tokenRepo = new VerificationTokenRepository();

//         if (!email) {
//             return res.status(400).json({
//                 message: 'Email address is required but was not provided by Google.',
//             });
//         }

//         let user = await userRepo.findByGoogleId(googleId) || await userRepo.findByEmail(email);

//         const isNewUser = !user;

//         if (!user) {
//             user = await userRepo.create({
//                 googleId,
//                 email,
//                 firstName: name,
//                 profilePicture: picture
//             });
//             console.log('New user created:', user);
//         }

//         if (!user.emailVerified) {
//             const verificationToken = generateRandomString(6, { type: 'alphanumericUpper' });

//             await tokenRepo.updateOrCreate({
//                 email,
//                 token: await hash(verificationToken),
//                 expires: addMinutes(new Date(), 10),
//             });

//             sendVerificationEmail(email, verificationToken).catch((err) => {
//                 logger.error(err, 'Failed to send verification email');
//             });

//             return res.status(200).json({
//                 message: 'Verification email sent. Please verify your email to continue.',
//                 user: {
//                     id: user._id,
//                     email: user.email,
//                     name: user.firstName,
//                     picture: user.profilePicture,
//                     emailVerified: false,
//                 },
//             });
//         }

//         return res.status(200).json({
//             message: isNewUser ? 'User signed up successfully' : 'User signed in successfully',
//             user: {
//                 id: user._id,
//                 email: user.email,
//                 name: user.firstName,
//                 picture: user.profilePicture,
//                 emailVerified: true,
//             },

//         });
//     } catch (error) {
//         console.error('Google callback error:', error);
//         return res.status(500).json({ message: 'Internal Server Error', error: error instanceof Error ? error.message : error });
//     }
// };




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
//         let user = await User.findOne({ googleId });

//         if (!user) {
//             user = new User({ googleId, email, firstName: name, profilePicture: picture });
//             user.emailVerified = new Date();
//             await user.save();
//         }

//         const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET as string, {
//             expiresIn: '1h',
//         });
//         res.status(200).json({
//             message: user ? 'User signed in successfully' : 'User signed up successfully',
//             user: {
//                 id: user._id,
//                 email: user.email,
//                 name: user.firstName,
//                 picture: user.profilePicture,
//                 emailVerified: new Date() ? new Date() : undefined,
//             },

//         });
//     } catch (error) {
//         console.error('Google callback error:', error);
//         return res.status(500).json({ message: 'Internal Server Error', error: error instanceof Error ? error.message : error });
//     }
// };
