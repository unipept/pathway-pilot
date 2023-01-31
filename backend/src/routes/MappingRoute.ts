import express from 'express';
import { 
    getKoMapping,
    getKoMappings,  
    getPathwayMapping, 
    getPathwayMappings 
} from '../controllers/MappingController';

const router = express.Router();

router.get('/pathway', getPathwayMappings);
router.get('/pathway/:pathwayId', getPathwayMapping);

router.get('/ko', getKoMappings);
router.get('/ko/:koId', getKoMapping);

export default router;
