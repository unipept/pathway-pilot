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

    // This documents current behaviour, not desired behaviour: findEcMapping
    // throws a plain Error('EC number not found'), and ErrorHandler renders
    // every error the same way, so an unknown id answers 500 rather than the
    // arguably-more-correct 404. Changing that is a separate concern and is
    // deliberately out of scope here.
    it('answers 500 with the generic ErrorHandler body', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});

        const res = await request(app).get('/mapping/ec/9.9.9.9');

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: 'Internal server error' });
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
