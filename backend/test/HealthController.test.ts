import { describe, expect, it, vi } from 'vitest';
import request from 'supertest';

// The ready path is already covered in http.test.ts. The degraded path --
// the one HealthController's doc comment says is the whole reason the
// endpoint reports counts rather than a bare boolean -- needs a map that
// reports zero entries. The maps are singletons built at import time from
// the fixture, which always populates all six, so getting one to report
// empty means mocking the module rather than starving the fixture: this
// file gets its own module registry from vitest, so replacing CompoundMap's
// default export with an empty Map here doesn't affect what any other test
// file sees of it.
vi.mock('../src/mappings/CompoundMap', () => ({
    default: new Map(),
}));

import app from '../src/app';

describe('GET /health when a map is empty', () => {
    it('answers 503 with status degraded and names exactly the empty map', async () => {
        const res = await request(app).get('/health');

        expect(res.status).toBe(503);
        expect(res.body.status).toBe('degraded');
        expect(res.body.maps.compound).toBe(0);
        expect(res.body.maps.ec).toBeGreaterThan(0);
        expect(res.body.emptyMaps).toEqual(['compound']);
    });
});
