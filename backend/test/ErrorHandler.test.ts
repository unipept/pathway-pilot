import { describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';

import errorHandler from '../src/middleware/ErrorHandler';

// Every route test drives this middleware through a request that hasn't
// written a response yet, so the res.headersSent branch (lines 15-16) never
// runs that way. Calling errorHandler directly as a unit, with a fake
// req/res/next, is the only practical way to exercise it: a route would
// need to write a real response body and then throw, which nothing in this
// app does.
describe('errorHandler when the response has already started', () => {
    it('delegates to next(err) instead of writing a second response', () => {
        const req = { method: 'GET', originalUrl: '/mapping/ec/1.1.1.1' } as Request;
        const res = {
            headersSent: true,
            status: vi.fn(),
            json: vi.fn(),
        } as unknown as Response;
        const next = vi.fn();
        const err = new Error('boom');

        errorHandler(err, req, res, next);

        expect(next).toHaveBeenCalledWith(err);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});
