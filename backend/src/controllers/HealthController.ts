import { Request, Response } from "express";

import compoundMap from "../mappings/CompoundMap";
import ecMap from "../mappings/EcMap";
import koMap from "../mappings/KoMap";
import moduleMap from "../mappings/ModuleMap";
import pathwayMap from "../mappings/PathwayMap";
import reactionMap from "../mappings/ReactionMap";

/**
 * Liveness and readiness in one endpoint.
 *
 * The mapping tables are built at import time, so the port does not open until
 * they are constructed -- which means "reachable" already implies "loaded".
 * What it does not imply is that they were loaded from *usable* data: since
 * backend/data is server-side state fetched from KEGG rather than something
 * committed, a failed or partial refresh leaves the maps constructed but empty,
 * and the API answers every lookup with nothing.
 *
 * So readiness here means every table has entries, and the counts are in the
 * body to make a partial refresh visible rather than merely detectable.
 */
export const getHealth = async (_req: Request, res: Response) => {
    const maps = {
        compound: compoundMap.size,
        ec: ecMap.size,
        ko: koMap.size,
        module: moduleMap.size,
        pathway: pathwayMap.size,
        reaction: reactionMap.size,
    };

    const empty = Object.entries(maps).filter(([, size]) => size === 0).map(([name]) => name);
    const ready = empty.length === 0;

    return res.status(ready ? 200 : 503).json({
        status: ready ? "ok" : "degraded",
        uptimeSeconds: Math.round(process.uptime()),
        maps,
        ...(ready ? {} : { emptyMaps: empty }),
    });
};
