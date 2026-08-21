import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';
import request from 'supertest';

import errorHandler from '../../src/middleware/ErrorHandler';
import app from '../../src/app';

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

// The two describes below drive errorHandler through a real request via
// supertest against the actual app, rather than calling it directly like the
// test above does -- they're proving its rendering contract end to end (no
// stack trace logged for a routine 404, a stack trace logged for anything
// else), which needs the router chain in front of it to produce a genuine
// NotFoundError and a genuine unexpected error.
describe('GET /mapping/ec/:ecNumber for an unknown id', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('does not write a stack trace for a 404', async () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(console, 'warn').mockImplementation(() => {});

        await request(app).get('/mapping/ec/9.9.9.9');

        expect(errorSpy).not.toHaveBeenCalled();
    });
});

describe('GET /mapping/ec/:ecNumber when the service throws an unexpected error', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.resetModules();
    });

    // Without this test, a fix that turned every error into a 404 would pass
    // the test above. Forcing a plain Error out of the service layer proves
    // the 500 path is still reachable and unweakened.
    it('still answers 500 with the generic body and logs the stack', async () => {
        vi.resetModules();
        vi.doMock('../../src/services/MappingService', async () => {
            const actual = await vi.importActual<typeof import('../../src/services/MappingService')>('../../src/services/MappingService');
            return {
                ...actual,
                findEcMapping: vi.fn().mockRejectedValue(new Error('boom'))
            };
        });

        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const { default: mockedApp } = await import('../../src/app');
        const res = await request(mockedApp).get('/mapping/ec/1.1.1.1');

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: 'Internal server error' });
        expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('[err] GET /mapping/ec/1.1.1.1 - boom'));
        expect(errorSpy).toHaveBeenCalledWith(expect.stringMatching(/^Error: boom\n\s+at /));
    });
});
