import express from 'express';

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../../swagger.json';

const router = express.Router();

const options = {
  explorer: true,
};

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument, options));

export default router;
