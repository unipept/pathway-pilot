import express from 'express';

import { getHealth } from '../controllers/HealthController';

const router = express.Router();

router.get('/', getHealth);

export default router;
