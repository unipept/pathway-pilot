import { afterEach, describe, expect, it, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import request from 'supertest';

// This is a separate file from http.test.ts specifically so axios can be
// mocked here: vi.mock is hoisted per test file, and http.test.ts imports
// the real `app` -- and through it the real axios -- at module scope for its
// own tests. Vitest gives every test file its own module registry, so
// mocking axios and importing `app` here doesn't touch what http.test.ts (or
// MappingRoute.test.ts) sees. Same mocking pattern as PathwayService.test.ts,
// which already covers findPathway's parsing; this only proves the
// controller and route wire that service up correctly, nothing new about the
// parsing itself.
vi.mock('axios', () => ({
    default: {
        get: vi.fn(),
    },
}));

import axios from 'axios';
import app from '../src/app';
import { RectanglePathwayNode, CirclePathwayNode, PolygonPathwayNode } from '../src/models/PathwayNode';

const fixtureHtml = fs.readFileSync(path.join(__dirname, 'fixtures/pathway-page.html'), 'utf-8');
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
