import { afterEach, describe, expect, it, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// axios is mocked so that nothing findPathway does ever hits the network -
// this is an explicit acceptance criterion, not just a convenience.
vi.mock('axios', () => ({
    default: {
        get: vi.fn(),
    },
}));

import axios from 'axios';
import { findPathway } from '../../src/services/PathwayService';
import { RectanglePathwayNode, CirclePathwayNode, PolygonPathwayNode } from '../../src/models/PathwayNode';

const fixtureHtml = fs.readFileSync(path.join(__dirname, '../fixtures/pathway-page.html'), 'utf-8');
const fixturePng = Buffer.from('not-a-real-png');

describe('findPathway', () => {
    afterEach(() => {
        vi.mocked(axios.get).mockReset();
    });

    it('converts rect/circle/poly areas into scaled PathwayNodes and the PNG into a data URL', async () => {
        vi.mocked(axios.get)
            .mockResolvedValueOnce({ data: fixtureHtml })
            .mockResolvedValueOnce({ data: fixturePng });

        const pathway = await findPathway('map00010');

        expect(axios.get).toHaveBeenCalledTimes(2);
        expect(pathway.image).toBe(`data:image/png;base64,${fixturePng.toString('base64')}`);
        // coords are scaled by 2 (rect/circle/poly all come from the same fixture area set)
        expect(pathway.nodes).toEqual([
            new RectanglePathwayNode(20, 40, 60, 80, 'Node A'),
            new CirclePathwayNode(100, 120, 30, 'Node B'),
            new PolygonPathwayNode('2,4,6,8,10,12', 'Node C'),
        ]);
    });

    it('throws for an unknown shape', async () => {
        const html = '<html><body><map id="mapdata"><area shape="hexagon" coords="1,2" title="Bad" /></map></body></html>';
        vi.mocked(axios.get)
            .mockResolvedValueOnce({ data: html })
            .mockResolvedValueOnce({ data: fixturePng });

        await expect(findPathway('map00010')).rejects.toThrow('Unknown shape: hexagon');
    });

    it('yields an empty node list when the page has no #mapdata', async () => {
        const html = '<html><body>no map here</body></html>';
        vi.mocked(axios.get)
            .mockResolvedValueOnce({ data: html })
            .mockResolvedValueOnce({ data: fixturePng });

        const pathway = await findPathway('map00010');

        expect(pathway.nodes).toEqual([]);
    });
});
