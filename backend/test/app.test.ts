import { describe, expect, it } from 'vitest';
import request from 'supertest';

// Covers the app's wiring rather than any single route or controller: the
// ready path of /health, and an unmatched path.
//
// The ready path lives here rather than in HealthController.test.ts because
// that file mocks CompoundMap to an empty Map at module scope to cover the
// degraded path -- a ready-path assertion there would see maps.compound as 0
// and fail. This file imports the real, unmocked `app`, so all six maps are
// built from the fixture as normal.
//
// /nope isn't a mapping route and never reaches errorHandler, so it belongs
// in neither MappingRoute.test.ts nor ErrorHandler.test.ts: it's proving that
// an unmatched path falls through to Express's own final handler rather than
// being swallowed by something this app registered.
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

describe('GET /nope', () => {
    it('falls through to Express\'s default 404', async () => {
        const res = await request(app).get('/nope');

        expect(res.status).toBe(404);
    });
});
