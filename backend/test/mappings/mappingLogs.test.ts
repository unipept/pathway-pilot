import { afterEach, describe, expect, it, vi } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';

describe('mapping link file logging', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('logs only the genuinely dangling reference when building the maps against the fixture', async () => {
        // The maps are singletons built at import time, so a spy installed
        // after a static import would already be too late. A dynamic import
        // is not hoisted, so it runs after the spy below is in place.
        const logs: string[] = [];
        vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
            logs.push(args.map(String).join(' '));
        });

        await import('../../src/mappings/EcMap');
        await import('../../src/mappings/PathwayMap');
        await import('../../src/mappings/KoMap');
        await import('../../src/mappings/CompoundMap');
        await import('../../src/mappings/ReactionMap');

        // The fixture has exactly one dangling reference: compound2module
        // links C00267, which is not in the compound entity table. That one
        // SHOULD be logged. Everything else in the fixture resolves, so any
        // other line here is the false positive this fix removes -- before
        // it, this list also held K00001 and K00844, both of which are
        // present and served fine.
        expect(logs.filter((l) => l.includes('not found'))).toEqual([
            'Compound id C00267 not found (compound2module)'
        ]);
    });

    it('still logs a genuinely absent entity, naming both the identifier and the link file', async () => {
        // Built directly against temp files, rather than the fixture, so the
        // missing id is under this test's control. KoMap is exported as a
        // class and takes all five file paths as constructor parameters.
        const { KoMap } = await import('../../src/mappings/KoMap');

        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'komap-log-'));

        const writeFile = (name: string, content: string) => {
            const file = path.join(tmpDir, name);
            fs.writeFileSync(file, content);
            return file;
        };

        const descriptionFile = writeFile('ko', 'K00001\tsome enzyme\n');
        const pathwayLinkFile = writeFile('ko2pathway', 'K00001\tmap00010\n');
        const moduleLinkFile = writeFile('ko2module', 'K00001\tM00001\n');
        // ec2ko links K00001 to an EC number, but the row below references a
        // KO number that was never in the description file above.
        const ecLinkFile = writeFile('ec2ko', '1.1.1.1\tK99999\n');
        const reactionLinkFile = writeFile('ko2reaction', 'K00001\tR00001\n');

        const logs: string[] = [];
        vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
            logs.push(args.map(String).join(' '));
        });

        new KoMap(descriptionFile, pathwayLinkFile, moduleLinkFile, ecLinkFile, reactionLinkFile);

        fs.rmSync(tmpDir, { recursive: true, force: true });

        expect(logs.some((l) => l.includes('K99999') && l.includes('ec2ko'))).toBe(true);
    });
});
