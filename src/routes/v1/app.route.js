// Routes created for testing purposes.
import express from 'express';
import { requireAuth } from '@skeldon/sdv3-shared-library';
import appController from '../../controllers/app.controller';
import catchAsync from '../../middlewares/catchAsync.middleware';

// destructuring controllers and middlewares
const { checkRouteProtection, checkUserLogged, sendWhatsappWelcomeMessage } =
  appController;

// define router express
const router = express.Router();

/**
 * TEST ROUTES
 */
router.get(
  '/test-route-protection',
  requireAuth,
  catchAsync(checkRouteProtection),
);

router.get('/test-check-user-logged', requireAuth, catchAsync(checkUserLogged));

router.post(
  '/test-whatsapp-welcome-message',
  requireAuth,
  catchAsync(sendWhatsappWelcomeMessage),
);
export default router;
