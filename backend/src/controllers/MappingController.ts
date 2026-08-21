import { Request, Response } from "express";
import { 
    findKoMapping, 
    findKoMappings,
    findEcMapping, 
    findEcMappings, 
    findPathwayMapping,
    findPathwayMappings,
    findReactionMapping,
    findReactionMappings,
    findCompoundMapping,
    findCompoundMappings
} from "../services/MappingService";

/**
 * Get pathway by mapId
 * 
 * @param req The request (params: pathwayId)
 * @param res The response
 * @returns   The resulting pathway
 */
export const getPathwayMapping = async (req: Request<{ pathwayId: string }>, res: Response) => {
    return res.status(200).json(await findPathwayMapping(req.params.pathwayId))
}

/**
 * Get the mapping for all pathways
 * 
 * @param req   The request
 * @param res   The response
 * @returns     The resulting pathway mapping
 */
export const getPathwayMappings = async (req: Request, res: Response) => {
    const mapping = await findPathwayMappings();
    return res.status(200).json(Object.fromEntries(mapping));
}

/**
 * Get KO information by KO number
 * 
 * @param req The request (params: koNumber)
 * @param res The response
 * @returns   The resulting KO information
 */
export const getKoMapping = async (req: Request<{ koNumber: string }>, res: Response) => {
    return res.status(200).json(await findKoMapping(req.params.koNumber))
}

/**
 * Get the mapping for all KO numbers
 * 
 * @param req   The request
 * @param res   The response
 * @returns     The resulting KO mapping
 */
export const getKoMappings = async (req: Request, res: Response) => {
    const mapping = await findKoMappings();
    return res.status(200).json(Object.fromEntries(mapping));
}

/**
 * Get EC information by EC number
 * 
 * @param req The request (params: ecNumber)
 * @param res The response
 * @returns   The resulting EC information
 */
export const getEcMapping = async (req: Request<{ ecNumber: string }>, res: Response) => {
    return res.status(200).json(await findEcMapping(req.params.ecNumber))
}

/**
 * Get the mapping for all EC numbers
 * 
 * @param req   The request
 * @param res   The response
 * @returns     The resulting EC mapping
 */
export const getEcMappings = async (req: Request, res: Response) => {
    const mapping = await findEcMappings();
    return res.status(200).json(Object.fromEntries(mapping));
}

/**
 * Get Reaction information by Reaction id
 * 
 * @param req The request (params: reactionId)
 * @param res The response
 * @returns   The resulting Reaction information
 */
export const getReactionMapping = async (req: Request<{ reactionId: string }>, res: Response) => {
    return res.status(200).json(await findReactionMapping(req.params.reactionId))
}

/**
 * Get the mapping for all Reaction ids
 * 
 * @param req   The request
 * @param res   The response
 * @returns     The resulting Reaction mapping
 */
export const getReactionMappings = async (req: Request, res: Response) => {
    const mapping = await findReactionMappings();
    return res.status(200).json(Object.fromEntries(mapping));
}

/**
 * Get compound information by compound id
 * 
 * @param req The request (params: compoundId)
 * @param res The response
 * @returns   The resulting compound information
 */
export const getCompoundMapping = async (req: Request<{ compoundId: string }>, res: Response) => {
    return res.status(200).json(await findCompoundMapping(req.params.compoundId))
}

/**
 * Get the mapping for all compound ids
 * 
 * @param req   The request
 * @param res   The response
 * @returns     The resulting compound mapping
 */
export const getCompoundMappings = async (req: Request, res: Response) => {
    const mapping = await findCompoundMappings();
    return res.status(200).json(Object.fromEntries(mapping));
}
