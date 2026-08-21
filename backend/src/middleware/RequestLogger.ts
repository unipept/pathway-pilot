import { NextFunction, Request, Response } from 'express';

/**
 * Logs one line per request once the response has been sent, so the status
 * and the duration are both known:
 *
 *   [req] GET /mapping/ec/1.1.1.1 200 12ms
 *   [req] GET /pathway/map00010 200 1843ms
 *
 * Written by hand rather than pulling in morgan: the backend has five runtime
 * dependencies and this is fifteen lines, so a dependency would be more
 * supply chain than the feature is worth. Swap it for morgan or pino if this
 * ever needs to be structured JSON.
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const startedAt = process.hrtime.bigint();

    // `finish` fires when the response has been handed to the OS, which is the
    // only point at which the status code is final.
    res.on('finish', () => {
        const ms = Number(process.hrtime.bigint() - startedAt) / 1e6;
        console.log(`[req] ${req.method} ${req.originalUrl} ${res.statusCode} ${ms.toFixed(0)}ms`);
    });

    next();
};

export default requestLogger;
