import express from 'express';

import { get } from '../controllers/PathwayController';

const router = express.Router();

router.get('/:mapId', get);

export default router;
