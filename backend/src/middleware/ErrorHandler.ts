import { NextFunction, Request, Response } from 'express';
import NotFoundError from '../errors/NotFoundError';

/**
 * Terminal error handler. Registered after the routers, so anything they throw
 * or reject with lands here instead of hanging the request or leaking a stack
 * trace to the caller.
 *
 * Express 5 forwards rejected promises from async handlers automatically, so
 * this catches those too -- under Express 4 it would not have.
 */
export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    // Express requires the four-argument shape to recognise this as an error
    // handler, and delegates to its default one if a response has already begun.
    if (res.headersSent) {
        return next(err);
    }

    // A not-found is not a fault -- the caller asked for an id the dataset
    // doesn't have. Answer 404 with the specific message and skip the stack
    // trace below, which would otherwise stack-spam the log for routine bad
    // input.
    if (err instanceof NotFoundError) {
        console.warn(`[404] ${req.method} ${req.originalUrl}`);
        return res.status(404).json({ error: err.message });
    }

    const message = err instanceof Error ? err.message : String(err);
    console.error(`[err] ${req.method} ${req.originalUrl} - ${message}`);
    if (err instanceof Error && err.stack) {
        console.error(err.stack);
    }

    res.status(500).json({ error: 'Internal server error' });
};

export default errorHandler;
