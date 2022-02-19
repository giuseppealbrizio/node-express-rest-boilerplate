import express from 'express';
import { requireAuth } from '@skeldon/sdv3-shared-library';
import authController from '../../controllers/auth.controller';
import passportGoogle from '../../services/passport/passport-google.service';

import catchAsync from '../../middlewares/catchAsync.middleware';

const {
  login,
  signup,
  logout,
  recoverPassword,
  resetPassword,
  socialAuth,
  loggedUser,
} = authController;

const router = express.Router();

router.post('/signup', catchAsync(signup));
router.post('/login', catchAsync(login));
router.post('/logout', catchAsync(logout));
router.post('/recover-password', catchAsync(recoverPassword));
router.post('/reset-password', catchAsync(resetPassword));
router.get('/me', requireAuth, catchAsync(loggedUser));

/**
 * Social Authentication: Google
 */
router.get(
  '/google',
  passportGoogle.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
  }),
);
// callback route for google authentication
router.get(
  '/google/callback',
  passportGoogle.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
  }),
  socialAuth,
);

export default router;
