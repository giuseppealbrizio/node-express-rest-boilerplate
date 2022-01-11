import express from 'express';
import { requireAuth } from '@skeldon/sdv3-shared-library';
import appController from '../../controllers/app.controller';
import catchAsync from '../../middlewares/catchAsync.middleware';
import { uploadSingleFileToGCS } from '../../middlewares/upload.middleware';

const { getAll, getOne, update, deleteOne } = appController;

const router = express.Router();

router.route('/').get(requireAuth, uploadSingleFileToGCS, catchAsync(getAll));

router
  .route('/:id')
  .get(requireAuth, uploadSingleFileToGCS, catchAsync(getOne))
  .patch(requireAuth, uploadSingleFileToGCS, catchAsync(update))
  .delete(requireAuth, uploadSingleFileToGCS, catchAsync(deleteOne));

export default router;
