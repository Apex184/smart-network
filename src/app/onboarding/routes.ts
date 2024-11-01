import { Router } from 'express';
import { googleAuthUrl } from './controllers';
import { authenticate, emailVerified, validate } from '@/lib/middlewares';

import {

    signUpController,
} from './controllers';
import {
    SignUpSchema,
} from './validations';

// const checkEmailVerification = [authenticate, emailVerified];

const router = Router();
router.get('/google/url', googleAuthUrl);
router.post('/', validate(SignUpSchema), signUpController);

export const onboardingRoutes = router;
