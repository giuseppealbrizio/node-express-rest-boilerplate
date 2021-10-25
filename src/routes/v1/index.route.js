import express from 'express';
import _ from 'lodash';

import appRoutes from 'app.route';
import publisherRoutes from './events/publisher.route';
import subscriberRoutes from './events/subscriber.route';
import swaggerRoutes from './swagger.route';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/',
    route: appRoutes,
  },
  {
    path: '/publisher',
    route: publisherRoutes,
  },
  {
    path: '/subscriber',
    route: subscriberRoutes,
  },
];

const devRoutes = [
  {
    path: '/documentation',
    route: swaggerRoutes,
  },
];

_.forEach(defaultRoutes, (route) => {
  router.use(route.path, route.route);
});

if (process.env.NODE_ENV === 'development') {
  _.forEach(devRoutes, (route) => {
    router.use(route.path, route.route);
  });
}

export default router;
