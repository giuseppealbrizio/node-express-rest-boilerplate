import express from 'express';
import { requireAuth } from '@skeldon/sdv3-shared-library';
import appController from '../../controllers/app.controller';
import catchAsync from '../../middlewares/catchAsync.middleware';
import { multerGCSUpload } from '../../middlewares/upload.middleware';

const { getAll, getOne, update, deleteOne } = appController;

const router = express.Router();

router
  .route('/')
  .get(requireAuth, multerGCSUpload.single('file'), catchAsync(getAll));

router
  .route('/:id')
  .get(requireAuth, multerGCSUpload.single('file'), catchAsync(getOne))
  .patch(requireAuth, multerGCSUpload.single('file'), catchAsync(update))
  .delete(requireAuth, multerGCSUpload.single('file'), catchAsync(deleteOne));

export default router;
