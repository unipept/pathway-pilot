import { Request, Response } from "express";
import { 
    findKoMapping, 
    findKoMappings,
    findEcMapping, 
    findEcMappings, 
    findPathwayMapping,
    findPathwayMappings
} from "../services/MappingService";

// TODO: Error handling

/**
 * Get pathway by mapId
 * 
 * @param req The request (params: pathwayId)
 * @param res The response
 * @returns   The resulting pathway
 */
export const getPathwayMapping = async (req: Request, res: Response) => {
    try {
        return res.status(200).json(await findPathwayMapping(req.params.pathwayId))
    } catch (err) {
        console.log(err);
    }
}

/**
 * Get the mapping for all pathways
 * 
 * @param req   The request
 * @param res   The response
 * @returns     The resulting pathway mapping
 */
export const getPathwayMappings = async (req: Request, res: Response) => {
    try {
        const mapping = await findPathwayMappings();
        return res.status(200).json(Object.fromEntries(mapping));
    } catch (err) {
        console.log(err);
    }
}

/**
 * Get KO information by KO number
 * 
 * @param req The request (params: koNumber)
 * @param res The response
 * @returns   The resulting KO information
 */
export const getKoMapping = async (req: Request, res: Response) => {
    try {
        return res.status(200).json(await findKoMapping(req.params.koNumber))
    } catch (err) {
        console.log(err);
    }
}

/**
 * Get the mapping for all KO numbers
 * 
 * @param req   The request
 * @param res   The response
 * @returns     The resulting KO mapping
 */
export const getKoMappings = async (req: Request, res: Response) => {
    try {
        const mapping = await findKoMappings();
        return res.status(200).json(Object.fromEntries(mapping));
    } catch (err) {
        console.log(err);
    }
}

/**
 * Get EC information by EC number
 * 
 * @param req The request (params: ecNumber)
 * @param res The response
 * @returns   The resulting EC information
 */
export const getEcMapping = async (req: Request, res: Response) => {
    try {
        return res.status(200).json(await findEcMapping(req.params.ecNumber))
    } catch (err) {
        console.log(err);
    }
}

/**
 * Get the mapping for all EC numbers
 * 
 * @param req   The request
 * @param res   The response
 * @returns     The resulting EC mapping
 */
export const getEcMappings = async (req: Request, res: Response) => {
    try {
        const mapping = await findEcMappings();
        return res.status(200).json(Object.fromEntries(mapping));
    } catch (err) {
        console.log(err);
    }
}
