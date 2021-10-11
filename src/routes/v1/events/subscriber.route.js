import express from 'express';
import {
  subscribeToPullEventExample,
  subscribeToPushEventExample,
} from '../../../controllers/events/subscriber.controller';
import catchAsync from '../../../middlewares/catchAsync.middleware';

const router = express.Router();

/**
 * PUSH ROUTES
 */
router.post(
  '/receive-push-sub-message',
  catchAsync(subscribeToPushEventExample),
);

/**
 * PULL ROUTES
 */
router.post(
  '/receive-pull-sub-message',
  catchAsync(subscribeToPullEventExample),
);

export default router;
