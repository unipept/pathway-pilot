import express from 'express';

import { getPathway } from '../controllers/PathwayController';

const router = express.Router();

router.get('/:mapId', getPathway);

export default router;
