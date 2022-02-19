import express from 'express';
import { requireAuth } from '@skeldon/sdv3-shared-library';
import userController from '../../controllers/user.controller';
import catchAsync from '../../middlewares/catchAsync.middleware';
import { uploadSingleFileToMS } from '../../middlewares/upload.middleware';
import { verifyRights } from '../../middlewares/verifyRights.middleware';

const {
  // Admin
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  softDeleteUserById,

  // Super admin
  updateUserPassword,
  hardDeleteUserById,
} = userController;

const router = express.Router();

/**
 * USER DEFAULT ROUTES
 */
router
  .route('/')
  .get(requireAuth, verifyRights('getUsers'), catchAsync(getAllUsers))
  .post(
    requireAuth,
    uploadSingleFileToMS,
    verifyRights('manageUsers'),
    catchAsync(createUser),
  );

router
  .route('/:userId')
  .get(requireAuth, verifyRights('getUsers'), catchAsync(getUserById))
  .patch(
    requireAuth,
    verifyRights('manageUsers'),
    uploadSingleFileToMS,
    catchAsync(updateUser),
  );

router.patch(
  '/:userId/soft-delete',
  requireAuth,
  verifyRights('manageUsers'),
  catchAsync(softDeleteUserById),
);

// Super Admin Routes - Feature Flags
router.patch(
  '/:userId/password',
  requireAuth,
  verifyRights('*', 'manageUsers'),
  catchAsync(updateUserPassword),
);

router.delete(
  '/:userId/hard-delete',
  requireAuth,
  verifyRights('*', 'deleteUsers'),
  catchAsync(hardDeleteUserById),
);

export default router;
