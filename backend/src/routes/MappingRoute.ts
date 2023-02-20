import express from 'express';
import { 
    getKoMapping,
    getKoMappings,
    getEcMapping,
    getEcMappings,  
    getPathwayMapping, 
    getPathwayMappings,
    getReactionMapping,
    getReactionMappings
} from '../controllers/MappingController';

const router = express.Router();

router.get('/pathway', getPathwayMappings);
router.get('/pathway/:pathwayId', getPathwayMapping);

router.get('/ko', getKoMappings);
router.get('/ko/:koNumber', getKoMapping);

router.get('/ec', getEcMappings);
router.get('/ec/:ecNumber', getEcMapping);

router.get('/reaction', getReactionMappings);
router.get('/reaction/:reactionId', getReactionMapping);

export default router;
