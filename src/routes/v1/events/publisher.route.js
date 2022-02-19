import express from 'express';
import { requireAuth } from '@skeldon/sdv3-shared-library';
import catchAsync from '../../../middlewares/catchAsync.middleware';

import { publishEventExample } from '../../../controllers/events/publisher.controller';

const router = express.Router();

router
  .route('/publish-event-example')
  .post(requireAuth, catchAsync(publishEventExample));

export default router;
