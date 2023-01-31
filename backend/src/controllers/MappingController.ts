import { Request, Response } from "express";
import { 
    findKoMapping, 
    findKoMappings, 
    findPathwayMapping,
    findPathwayMappings
} from "../services/MappingService";

export const getPathwayMapping = async (req: Request, res: Response) => {
    try {
        return res.status(200).json(await findPathwayMapping(req.params.pathwayId))
    } catch (err) {
        console.log(err);
    }
}

export const getPathwayMappings = async (req: Request, res: Response) => {
    try {
        const mapping = await findPathwayMappings();
        return res.status(200).json(mapping.toJson());
    } catch (err) {
        console.log(err);
    }
}

export const getKoMapping = async (req: Request, res: Response) => {
    try {
        return res.status(200).json(await findKoMapping(req.params.koId))
    } catch (err) {
        console.log(err);
    }
}

export const getKoMappings = async (req: Request, res: Response) => {
    try {
        const mapping = await findKoMappings();
        return res.status(200).json(mapping.toJson());
    } catch (err) {
        console.log(err);
    }
}
