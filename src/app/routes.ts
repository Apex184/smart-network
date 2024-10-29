import { Router } from 'express';

import { onboardingRoutes } from './onboarding/routes';

const router = Router();


router.use('/onboarding', onboardingRoutes);


export { router as appRoutes };
