import { Request, Response } from "express";

import { getPathway } from "../services/PathwayService";

export const get = async (req: Request, res: Response) => {
    try {
        const pathway = await getPathway(req.params.mapId);
        return res.status(200).json(pathway);
    } catch (err) {
        console.log(err);
    }
}
