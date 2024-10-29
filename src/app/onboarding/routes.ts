import { Router } from 'express';

import { authenticate, emailVerified, validate } from '@/lib/middlewares';

import {

    signUpController,
} from './controllers';
import {
    SignUpSchema,
} from './validations';

// const checkEmailVerification = [authenticate, emailVerified];

const router = Router();

router.post('/', validate(SignUpSchema), signUpController);

// router.use(checkEmailVerification);
// router.get('/upload', getUploadUrlController);
// router.post('/profiles', validate(CreateProfileSchema), createProfileController);
// router.post('/profiles/teachers', validate(CreateTeacherProfileSchema), createTeacherProfileController);
// router.post('/profiles/:studentId/parents', validate(ParentProfileSchema), parentProfileController);
// router.post(
//     '/profiles/:studentId/parents/contacts',
//     validate(ParentUpdateContactSchema),
//     parentUpdateContactController,
// );
// router.post('/profiles/:studentId/parents/children', validate(StudentUpdateSchema), parentUpdateChildDetailsController);

export const onboardingRoutes = router;
