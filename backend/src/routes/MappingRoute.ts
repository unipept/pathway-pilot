import express from 'express';
import { 
    getKoMapping,
    getKoMappings,
    getEcMapping,
    getEcMappings,  
    getPathwayMapping, 
    getPathwayMappings 
} from '../controllers/MappingController';

const router = express.Router();

router.get('/pathway', getPathwayMappings);
router.get('/pathway/:pathwayId', getPathwayMapping);

router.get('/ko', getKoMappings);
router.get('/ko/:koNumber', getKoMapping);

router.get('/ec', getEcMappings);
router.get('/ec/:ecNumber', getEcMapping);

export default router;
