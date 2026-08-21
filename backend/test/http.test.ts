import { afterEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

// app.ts builds the Express app but never calls listen, so importing it here
// exercises the real middleware/router chain -- including the six mapping
// singletons, built from the fixture the same way EcMap.test.ts relies on --
// without ever opening a port.
import app from '../src/app';

describe('GET /health', () => {
    it('reports ready with a non-zero count for every map', async () => {
        const res = await request(app).get('/health');

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
        expect(res.body.maps.compound).toBeGreaterThan(0);
        expect(res.body.maps.ec).toBeGreaterThan(0);
        expect(res.body.maps.ko).toBeGreaterThan(0);
        expect(res.body.maps.module).toBeGreaterThan(0);
        expect(res.body.maps.pathway).toBeGreaterThan(0);
        expect(res.body.maps.reaction).toBeGreaterThan(0);
    });
});

describe('GET /mapping/ec/1.1.1.1', () => {
    it('returns the mapping the fixture yields', async () => {
        const res = await request(app).get('/mapping/ec/1.1.1.1');

        expect(res.status).toBe(200);
        // Asserted as a whole object rather than by substring: the `backend ·
        // boots` job can only grep the response text, so it would pass with
        // the right values in the wrong fields. Here we can do better.
        expect(res.body).toEqual({
            names: ['alcohol dehydrogenase', 'aldehyde reductase', 'ADH'],
            pathways: [{ id: 'map00010', name: 'Glycolysis / Gluconeogenesis' }],
            modules: [],
            koNumbers: ['K00001'],
            reactionIds: ['R00623']
        });
    });
});

describe('GET /mapping/ec/:ecNumber for an unknown id', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('answers 404 with a body naming what was not found', async () => {
        vi.spyOn(console, 'warn').mockImplementation(() => {});

        const res = await request(app).get('/mapping/ec/9.9.9.9');

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: 'EC number not found' });
    });

    it('does not write a stack trace for a 404', async () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(console, 'warn').mockImplementation(() => {});

        await request(app).get('/mapping/ec/9.9.9.9');

        expect(errorSpy).not.toHaveBeenCalled();
    });
});

describe('GET /mapping/:type/:id for an unknown id', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('answers 404 for an unknown KO number', async () => {
        vi.spyOn(console, 'warn').mockImplementation(() => {});

        const res = await request(app).get('/mapping/ko/K99999');

        expect(res.status).toBe(404);
    });

    it('answers 404 for an unknown pathway id', async () => {
        vi.spyOn(console, 'warn').mockImplementation(() => {});

        const res = await request(app).get('/mapping/pathway/map99999');

        expect(res.status).toBe(404);
    });

    it('answers 404 for an unknown reaction id', async () => {
        vi.spyOn(console, 'warn').mockImplementation(() => {});

        const res = await request(app).get('/mapping/reaction/R99999');

        expect(res.status).toBe(404);
    });

    it('answers 404 for an unknown compound id', async () => {
        vi.spyOn(console, 'warn').mockImplementation(() => {});

        const res = await request(app).get('/mapping/compound/C99999');

        expect(res.status).toBe(404);
    });
});

describe('GET /mapping/ec/:ecNumber when the service throws an unexpected error', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.resetModules();
    });

    // Without this test, a fix that turned every error into a 404 would pass
    // the tests above. Forcing a plain Error out of the service layer proves
    // the 500 path is still reachable and unweakened.
    it('still answers 500 with the generic body and logs the stack', async () => {
        vi.resetModules();
        vi.doMock('../src/services/MappingService', async () => {
            const actual = await vi.importActual<typeof import('../src/services/MappingService')>('../src/services/MappingService');
            return {
                ...actual,
                findEcMapping: vi.fn().mockRejectedValue(new Error('boom'))
            };
        });

        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const { default: mockedApp } = await import('../src/app');
        const res = await request(mockedApp).get('/mapping/ec/1.1.1.1');

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: 'Internal server error' });
        expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('[err] GET /mapping/ec/1.1.1.1 - boom'));
        expect(errorSpy).toHaveBeenCalledWith(expect.stringMatching(/^Error: boom\n\s+at /));
    });
});

describe('GET /mapping/ec', () => {
    it('returns an object keyed by EC number', async () => {
        const res = await request(app).get('/mapping/ec');

        expect(res.status).toBe(200);
        expect(res.body['1.1.1.1']).toBeDefined();
        expect(res.body['1.1.1.1'].names).toContain('alcohol dehydrogenase');
    });
});

describe('GET /nope', () => {
    it('falls through to Express\'s default 404', async () => {
        const res = await request(app).get('/nope');

        expect(res.status).toBe(404);
    });
});
