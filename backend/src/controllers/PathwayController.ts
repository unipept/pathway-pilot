import { Request, Response } from "express";

import { findPathway } from "../services/PathwayService";

// TODO: Error handling

/**
 * Get pathway by pathwayId
 * 
 * @param req The request (params: pathwayId)
 * @param res The response
 * @returns   The resulting pathway
 */
export const getPathway = async (req: Request, res: Response) => {
    try {
        const pathway = await findPathway(req.params.pathwayId);
        return res.status(200).json(pathway);
    } catch (err) {
        console.log(err);
    }
}
