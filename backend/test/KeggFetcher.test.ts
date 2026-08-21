import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// KeggFetcher writes to the paths held in config.*DataFile / config.*LinkFile.
// Under vitest.config.ts those resolve into backend/.fixture/ - the same
// directory EcMap.test.ts and friends read from. Letting KeggFetcher write
// for real in this file would race with (and corrupt) that shared fixture,
// so every *DataFile / *LinkFile path is redirected into a throwaway temp
// dir before src/cronjobs/KeggFetcher is ever imported.
//
// vi.mock is hoisted above the imports below, so the temp dir and the
// replacement paths are built inside vi.hoisted, using require() rather than
// the (not-yet-bound) ESM imports of fs/os/path.
const { tmpDir, mockConfig } = vi.hoisted(() => {
    const fs = require('fs');
    const os = require('os');
    const path = require('path');

    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'kegg-fetcher-'));
    const dataFile = (name: string) => path.join(dir, name);
    const linkFile = (name: string) => path.join(dir, 'link', name);

    return {
        tmpDir: dir,
        mockConfig: {
            ecDataFile: dataFile('ec'),
            koDataFile: dataFile('ko'),
            reactionDataFile: dataFile('reaction'),
            compoundDataFile: dataFile('compound'),
            moduleDataFile: dataFile('module'),
            pathwayDataFile: dataFile('pathway'),

            ecKoLinkFile: linkFile('ec2ko'),
            ecReactionLinkFile: linkFile('ec2reaction'),
            ecCompoundLinkFile: linkFile('ec2compound'),
            ecPathwayLinkFile: linkFile('ec2pathway'),
            ecModuleLinkFile: linkFile('ec2module'),
            koReactionLinkFile: linkFile('ko2reaction'),
            koPathwayLinkFile: linkFile('ko2pathway'),
            koModuleLinkFile: linkFile('ko2module'),
            reactionCompoundLinkFile: linkFile('reaction2compound'),
            reactionPathwayLinkFile: linkFile('reaction2pathway'),
            reactionModuleLinkFile: linkFile('reaction2module'),
            compoundPathwayLinkFile: linkFile('compound2pathway'),
            compoundModuleLinkFile: linkFile('compound2module'),
        },
    };
});

vi.mock('../src/config/config', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../src/config/config')>();

    return { default: { ...actual.default, ...mockConfig } };
});

// axios is mocked so fetchFiles() never reaches rest.kegg.jp - an explicit
// acceptance criterion, not just a convenience. Same pattern as
// PathwayService.test.ts.
vi.mock('axios', () => ({
    default: {
        get: vi.fn(),
    },
}));

import axios from 'axios';
import KeggFetcher from '../src/cronjobs/KeggFetcher';

// The 19 fetches KeggFetcher.fetchFiles() runs, in the exact order it runs
// them (see the `steps` array in src/cronjobs/KeggFetcher.ts). Each raw
// value is what rest.kegg.jp actually returns: `ec:`/`ko:`/`rn:`/`cpd:`/
// `path:`/`md:`-prefixed ids, tab-separated. The pathway link endpoints also
// mix in the enzyme/ortholog/reaction-specific "path:ec…" / "path:ko…" /
// "path:rn…" pathway variant alongside the generic "path:map…" one, which is
// what the `filter*Path` methods exist to drop.
//
// This is deliberately the same EC-1.1.1.1-centred slice
// scripts/make-test-fixture.sh writes, so the expected `trimmed` values
// below double as a check that KeggFetcher's own transform produces exactly
// what that fixture (and therefore every parser test) already assumes.
const raw = {
    ec: 'ec:1.1.1.1\talcohol dehydrogenase; aldehyde reductase; ADH\nec:2.7.1.1\thexokinase; glucokinase',
    ko: 'ko:K00001\tE1.1.1.1, adh; alcohol dehydrogenase [EC:1.1.1.1]\nko:K00844\tHK; hexokinase [EC:2.7.1.1]',
    reaction: 'rn:R00623\talcohol dehydrogenase reaction\nrn:R00299\thexokinase reaction',
    compound: 'cpd:C00001\tH2O; Water\ncpd:C00022\tPyruvate',
    pathway: 'path:map00010\tGlycolysis / Gluconeogenesis\npath:map01100\tMetabolic pathways',
    module: 'md:M00001\tGlycolysis (Embden-Meyerhof pathway), glucose => pyruvate',

    ec2ko: 'ec:1.1.1.1\tko:K00001\nec:2.7.1.1\tko:K00844',
    ec2reaction: 'ec:1.1.1.1\trn:R00623\nec:2.7.1.1\trn:R00299',
    ec2compound: 'ec:1.1.1.1\tcpd:C00001',
    ec2pathway: 'ec:1.1.1.1\tpath:map00010\nec:2.7.1.1\tpath:map00010\nec:1.1.1.1\tpath:ec00010',
    ec2module: 'ec:2.7.1.1\tmd:M00001',
    ko2reaction: 'ko:K00001\trn:R00623',
    ko2pathway: 'ko:K00001\tpath:map00010\nko:K00001\tpath:ko00010',
    ko2module: 'ko:K00844\tmd:M00001',
    reaction2compound: 'rn:R00623\tcpd:C00001',
    reaction2pathway: 'rn:R00623\tpath:map00010\nrn:R00623\tpath:rn00010',
    reaction2module: 'rn:R00299\tmd:M00001',
    compound2pathway: 'cpd:C00022\tpath:map00010',
    compound2module: 'cpd:C00267\tmd:M00001',
};

const trimmed = {
    ec: '1.1.1.1\talcohol dehydrogenase; aldehyde reductase; ADH\n2.7.1.1\thexokinase; glucokinase',
    ko: 'K00001\tE1.1.1.1, adh; alcohol dehydrogenase [EC:1.1.1.1]\nK00844\tHK; hexokinase [EC:2.7.1.1]',
    reaction: 'R00623\talcohol dehydrogenase reaction\nR00299\thexokinase reaction',
    compound: 'C00001\tH2O; Water\nC00022\tPyruvate',
    pathway: 'map00010\tGlycolysis / Gluconeogenesis\nmap01100\tMetabolic pathways',
    module: 'M00001\tGlycolysis (Embden-Meyerhof pathway), glucose => pyruvate',

    ec2ko: '1.1.1.1\tK00001\n2.7.1.1\tK00844',
    ec2reaction: '1.1.1.1\tR00623\n2.7.1.1\tR00299',
    ec2compound: '1.1.1.1\tC00001',
    // the `path:ec00010` row is dropped by filterEcPath
    ec2pathway: '1.1.1.1\tmap00010\n2.7.1.1\tmap00010',
    ec2module: '2.7.1.1\tM00001',
    ko2reaction: 'K00001\tR00623',
    // the `path:ko00010` row is dropped by filterKoPath
    ko2pathway: 'K00001\tmap00010',
    ko2module: 'K00844\tM00001',
    reaction2compound: 'R00623\tC00001',
    // the `path:rn00010` row is dropped by filterReactionPath
    reaction2pathway: 'R00623\tmap00010',
    reaction2module: 'R00299\tM00001',
    compound2pathway: 'C00022\tmap00010',
    compound2module: 'C00267\tM00001',
};

// Same order as the `steps` array in KeggFetcher.fetchFiles(), which is the
// order axios.get is actually called in - mockResolvedValueOnce queues
// resolve in call order, not by URL, so this ordering is load-bearing.
const orderedKeys: (keyof typeof raw)[] = [
    'ec', 'ko', 'reaction', 'compound', 'pathway', 'module',
    'ec2ko', 'ec2reaction', 'ec2compound', 'ec2pathway', 'ec2module',
    'ko2reaction', 'ko2pathway', 'ko2module',
    'reaction2compound', 'reaction2pathway', 'reaction2module',
    'compound2pathway', 'compound2module',
];

const mockAllRequestsSucceed = () => {
    const get = vi.mocked(axios.get);
    for (const key of orderedKeys) {
        get.mockResolvedValueOnce({ data: raw[key] });
    }
};

const fixtureEcFile = path.join(__dirname, '../.fixture/ec');

describe('KeggFetcher#fetchFiles', () => {
    let fixtureBefore: string;

    beforeEach(() => {
        // Read before every test in this suite, not just once, so a leak in
        // any individual test (not only the whole file) would be caught.
        fixtureBefore = fs.readFileSync(fixtureEcFile, 'utf-8');

        // Start each test with an empty tmp dir so a file left behind by one
        // test (e.g. "writes every file") can't make a later test's
        // existsSync-is-false assertion pass for the wrong reason.
        fs.rmSync(tmpDir, { recursive: true, force: true });
        fs.mkdirSync(tmpDir, { recursive: true });
    });

    afterEach(() => {
        vi.mocked(axios.get).mockReset();

        // The whole point of the config mock above is that KeggFetcher never
        // writes into backend/.fixture/. Assert that directly, every time,
        // so a regression in the mocking fails loudly here instead of
        // corrupting EcMap.test.ts and friends.
        expect(fs.readFileSync(fixtureEcFile, 'utf-8')).toBe(fixtureBefore);
    });

    afterAll(() => {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    it('writes every file it claims to, with ids stripped of their KEGG prefix', async () => {
        mockAllRequestsSucceed();

        await new KeggFetcher().fetchFiles();

        expect(fs.readFileSync(mockConfig.ecDataFile, 'utf-8')).toBe(trimmed.ec);
        expect(fs.readFileSync(mockConfig.koDataFile, 'utf-8')).toBe(trimmed.ko);
        expect(fs.readFileSync(mockConfig.reactionDataFile, 'utf-8')).toBe(trimmed.reaction);
        expect(fs.readFileSync(mockConfig.compoundDataFile, 'utf-8')).toBe(trimmed.compound);
        expect(fs.readFileSync(mockConfig.pathwayDataFile, 'utf-8')).toBe(trimmed.pathway);
        expect(fs.readFileSync(mockConfig.moduleDataFile, 'utf-8')).toBe(trimmed.module);

        expect(fs.readFileSync(mockConfig.ecKoLinkFile, 'utf-8')).toBe(trimmed.ec2ko);
        expect(fs.readFileSync(mockConfig.ecReactionLinkFile, 'utf-8')).toBe(trimmed.ec2reaction);
        expect(fs.readFileSync(mockConfig.ecCompoundLinkFile, 'utf-8')).toBe(trimmed.ec2compound);
        expect(fs.readFileSync(mockConfig.ecPathwayLinkFile, 'utf-8')).toBe(trimmed.ec2pathway);
        expect(fs.readFileSync(mockConfig.ecModuleLinkFile, 'utf-8')).toBe(trimmed.ec2module);
        expect(fs.readFileSync(mockConfig.koReactionLinkFile, 'utf-8')).toBe(trimmed.ko2reaction);
        expect(fs.readFileSync(mockConfig.koPathwayLinkFile, 'utf-8')).toBe(trimmed.ko2pathway);
        expect(fs.readFileSync(mockConfig.koModuleLinkFile, 'utf-8')).toBe(trimmed.ko2module);
        expect(fs.readFileSync(mockConfig.reactionCompoundLinkFile, 'utf-8')).toBe(trimmed.reaction2compound);
        expect(fs.readFileSync(mockConfig.reactionPathwayLinkFile, 'utf-8')).toBe(trimmed.reaction2pathway);
        expect(fs.readFileSync(mockConfig.reactionModuleLinkFile, 'utf-8')).toBe(trimmed.reaction2module);
        expect(fs.readFileSync(mockConfig.compoundPathwayLinkFile, 'utf-8')).toBe(trimmed.compound2pathway);
        expect(fs.readFileSync(mockConfig.compoundModuleLinkFile, 'utf-8')).toBe(trimmed.compound2module);

        expect(axios.get).toHaveBeenCalledTimes(orderedKeys.length);
    });

    it('drops the enzyme/ortholog/reaction-specific pathway variant and keeps only path:map…', async () => {
        // Highest-value assertion in this slice: a regression in
        // stripPathway or the filter*Path predicates would still produce a
        // file that parses without error (PathwayMap just reads whatever
        // lines are there) but silently maps the wrong - or no - pathway.
        mockAllRequestsSucceed();

        await new KeggFetcher().fetchFiles();

        const ec2pathway = fs.readFileSync(mockConfig.ecPathwayLinkFile, 'utf-8');
        expect(ec2pathway).toBe('1.1.1.1\tmap00010\n2.7.1.1\tmap00010');
        expect(ec2pathway).not.toContain('path:');
        expect(ec2pathway).not.toContain('ec:');
    });

    it('rejects and stops writing further files when a request fails', async () => {
        const get = vi.mocked(axios.get);
        // ec (1st) and ko (2nd) succeed; reaction (3rd) fails.
        get.mockResolvedValueOnce({ data: raw.ec });
        get.mockResolvedValueOnce({ data: raw.ko });
        get.mockRejectedValueOnce(new Error('network down'));

        await expect(new KeggFetcher().fetchFiles()).rejects.toThrow('network down');

        // The files before the failing step were written...
        expect(fs.readFileSync(mockConfig.ecDataFile, 'utf-8')).toBe(trimmed.ec);
        expect(fs.readFileSync(mockConfig.koDataFile, 'utf-8')).toBe(trimmed.ko);
        // ...but nothing after the failure ran.
        expect(fs.existsSync(mockConfig.reactionDataFile)).toBe(false);
        expect(axios.get).toHaveBeenCalledTimes(3);
    });
});
