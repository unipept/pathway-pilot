import { afterEach, describe, expect, it, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import request from 'supertest';

// This is a separate file from MappingRoute.test.ts and ../app.test.ts
// specifically so axios can be mocked here: vi.mock is hoisted per test file,
// and those files import the real `app` -- and through it the real axios --
// at module scope for their own tests. Vitest gives every test file its own
// module registry, so mocking axios and importing `app` here doesn't touch
// what they see. Same mocking pattern as ../services/PathwayService.test.ts,
// which already covers findPathway's parsing; this only proves the
// controller and route wire that service up correctly, nothing new about the
// parsing itself.
vi.mock('axios', () => ({
    default: {
        get: vi.fn(),
    },
}));

import axios from 'axios';
import app from '../../src/app';
import { RectanglePathwayNode, CirclePathwayNode, PolygonPathwayNode } from '../../src/models/PathwayNode';

const fixtureHtml = fs.readFileSync(path.join(__dirname, '../fixtures/pathway-page.html'), 'utf-8');
const fixturePng = Buffer.from('not-a-real-png');

describe('GET /pathway/:pathwayId', () => {
    afterEach(() => {
        vi.mocked(axios.get).mockReset();
    });

    it('returns 200 with the { image, nodes } shape, never touching the network', async () => {
        vi.mocked(axios.get)
            .mockResolvedValueOnce({ data: fixtureHtml })
            .mockResolvedValueOnce({ data: fixturePng });

        const res = await request(app).get('/pathway/map00010');

        expect(axios.get).toHaveBeenCalledTimes(2);
        expect(res.status).toBe(200);
        expect(res.body.image).toBe(`data:image/png;base64,${fixturePng.toString('base64')}`);
        expect(res.body.nodes).toEqual([
            new RectanglePathwayNode(20, 40, 60, 80, 'Node A'),
            new CirclePathwayNode(100, 120, 30, 'Node B'),
            new PolygonPathwayNode('2,4,6,8,10,12', 'Node C'),
        ]);
    });
});

describe('GET /pathway/:pathwayId when KEGG cannot be reached', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.mocked(axios.get).mockReset();
    });

    // findPathway has no try/catch of its own: it lets the axios rejection
    // propagate, Express 5 forwards it out of the async handler, and
    // ErrorHandler turns it into a 500. That is three components deep and the
    // only route in the app that can fail because something outside it is
    // down, so it is worth proving end to end rather than assuming.
    it('answers 500 with the generic body instead of leaking the upstream error', async () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.mocked(axios.get).mockRejectedValueOnce(new Error('getaddrinfo ENOTFOUND rest.kegg.jp'));

        const res = await request(app).get('/pathway/map00010');

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: 'Internal server error' });
        // The upstream message names an internal host and must not reach the
        // caller, only the log.
        expect(JSON.stringify(res.body)).not.toContain('rest.kegg.jp');
        expect(errorSpy).toHaveBeenCalledWith(
            expect.stringContaining('[err] GET /pathway/map00010 - getaddrinfo ENOTFOUND rest.kegg.jp')
        );
    });

    // The PNG is fetched after the HTML has already parsed, so a failure here
    // takes a different path out of findPathway than the one above. Without
    // this, a stray try/catch around only the first request would still pass.
    it('answers 500 when the HTML arrives but the image request fails', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.mocked(axios.get)
            .mockResolvedValueOnce({ data: fixtureHtml })
            .mockRejectedValueOnce(new Error('Request failed with status code 404'));

        const res = await request(app).get('/pathway/map00010');

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: 'Internal server error' });
    });
});
