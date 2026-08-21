import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';

// Static imports, deliberately: importing any of these modules builds its
// default singleton against the fixture as a side effect, and that build logs
// one line of its own (compound2module's dangling C00267). Doing it here, at
// load time, keeps that line out of every spy installed below. It is also why
// these tests live in their own file rather than in mappingLogs.test.ts, whose
// first test needs these modules to be *un*loaded when it runs -- vitest gives
// each test file its own module registry, so neither file can spoil the other.
import { CompoundMap } from '../../src/mappings/CompoundMap';
import { EcMap } from '../../src/mappings/EcMap';
import { KoMap } from '../../src/mappings/KoMap';
import { PathwayMap } from '../../src/mappings/PathwayMap';
import { ReactionMap } from '../../src/mappings/ReactionMap';

// Every map warns when a link file references an id that its entity table
// never defined -- the one signal that a KEGG refresh landed half-applied.
// The shared fixture can only ever exercise one of these branches at a time
// (a dangling id there would break the mapping tests that read the same
// files), so each map is built here against temp files of this test's own,
// with a *different* missing id per link file. Asserting the full set of
// lines in one go pins down which file each message names: a handler that
// logged another handler's basename would still look right one line at a time.
describe('dangling references in link files', () => {
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'dangling-refs-'));

    afterAll(() => {
        fs.rmSync(tmpRoot, { recursive: true, force: true });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // Writes one directory per map and hands back a path builder, so the file
    // names below are the real KEGG ones -- the log message quotes them.
    const files = (name: string, contents: Record<string, string>) => {
        const dir = path.join(tmpRoot, name);
        fs.mkdirSync(dir);
        return Object.fromEntries(
            Object.entries(contents).map(([file, content]) => {
                const full = path.join(dir, file);
                fs.writeFileSync(full, content);
                return [file, full];
            })
        ) as Record<string, string>;
    };

    const captureLogs = () => {
        const logs: string[] = [];
        vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
            logs.push(args.map(String).join(' '));
        });
        return logs;
    };

    it('EcMap names the EC number and the file for all four of its link files', () => {
        const f = files('ec', {
            ec: '1.1.1.1\talcohol dehydrogenase\n',
            ec2pathway: '9.9.9.9\tmap00010\n',
            ec2module: '9.9.9.8\tM00001\n',
            ec2ko: '9.9.9.7\tK00001\n',
            ec2reaction: '9.9.9.6\tR00623\n',
        });

        const logs = captureLogs();
        new EcMap(f.ec, f.ec2pathway, f.ec2module, f.ec2ko, f.ec2reaction);

        expect(logs).toEqual([
            'EC number 9.9.9.9 not found (ec2pathway)',
            'EC number 9.9.9.8 not found (ec2module)',
            'EC number 9.9.9.7 not found (ec2ko)',
            'EC number 9.9.9.6 not found (ec2reaction)',
        ]);
    });

    it('KoMap names the KO number and the file, including where it is the second column', () => {
        // ec2ko is keyed by EC number, so the KO number KoMap looks up is the
        // second field there and the first everywhere else.
        const f = files('ko', {
            ko: 'K00001\tE1.1.1.1, adh; alcohol dehydrogenase [EC:1.1.1.1]\n',
            ko2pathway: 'K99999\tmap00010\n',
            ko2module: 'K99998\tM00001\n',
            ec2ko: '1.1.1.1\tK99997\n',
            ko2reaction: 'K99996\tR00623\n',
        });

        const logs = captureLogs();
        new KoMap(f.ko, f.ko2pathway, f.ko2module, f.ec2ko, f.ko2reaction);

        expect(logs).toEqual([
            'KO number K99999 not found (ko2pathway)',
            'KO number K99998 not found (ko2module)',
            'KO number K99997 not found (ec2ko)',
            'KO number K99996 not found (ko2reaction)',
        ]);
    });

    it('PathwayMap names the pathway and the file for all four of its link files', () => {
        // Every one of PathwayMap's link files is keyed by the *other* entity,
        // so the pathway id is the second column in all four.
        const f = files('pathway', {
            pathway: 'map00010\tGlycolysis / Gluconeogenesis\n',
            ec2pathway: '1.1.1.1\tmap99999\n',
            ko2pathway: 'K00001\tmap99998\n',
            reaction2pathway: 'R00623\tmap99997\n',
            compound2pathway: 'C00001\tmap99996\n',
        });

        const logs = captureLogs();
        new PathwayMap(f.pathway, f.ec2pathway, f.ko2pathway, f.reaction2pathway, f.compound2pathway);

        expect(logs).toEqual([
            'Pathway map99999 not found (ec2pathway)',
            'Pathway map99998 not found (ko2pathway)',
            'Pathway map99997 not found (reaction2pathway)',
            'Pathway map99996 not found (compound2pathway)',
        ]);
    });

    it('ReactionMap names the reaction id and the file for all three of its link files', () => {
        const f = files('reaction', {
            reaction: 'R00623\talcohol dehydrogenase reaction\n',
            reaction2pathway: 'R99999\tmap00010\n',
            reaction2module: 'R99998\tM00001\n',
            ec2reaction: '1.1.1.1\tR99997\n',
        });

        const logs = captureLogs();
        new ReactionMap(f.reaction, f.reaction2pathway, f.reaction2module, f.ec2reaction);

        expect(logs).toEqual([
            'Reaction id R99999 not found (reaction2pathway)',
            'Reaction id R99998 not found (reaction2module)',
            'Reaction id R99997 not found (ec2reaction)',
        ]);
    });

    it('CompoundMap names the compound id and the file for all four of its link files', () => {
        // compound2module is the one branch the shared fixture already covers;
        // the other three are only reachable from here.
        const f = files('compound', {
            compound: 'C00001\tH2O; Water\n',
            compound2pathway: 'C99999\tmap00010\n',
            compound2module: 'C99998\tM00001\n',
            ec2compound: '1.1.1.1\tC99997\n',
            reaction2compound: 'R00623\tC99996\n',
        });

        const logs = captureLogs();
        new CompoundMap(f.compound, f.compound2pathway, f.compound2module, f.ec2compound, f.reaction2compound);

        expect(logs).toEqual([
            'Compound id C99999 not found (compound2pathway)',
            'Compound id C99998 not found (compound2module)',
            'Compound id C99997 not found (ec2compound)',
            'Compound id C99996 not found (reaction2compound)',
        ]);
    });

    it('says nothing when every reference resolves', () => {
        // The counterpart the four tests above need: proof that the warning is
        // driven by the dangling id and not simply by the handler running.
        const f = files('resolved', {
            ec: '1.1.1.1\talcohol dehydrogenase\n',
            ec2pathway: '1.1.1.1\tmap00010\n',
            ec2module: '1.1.1.1\tM00001\n',
            ec2ko: '1.1.1.1\tK00001\n',
            ec2reaction: '1.1.1.1\tR00623\n',
        });

        const logs = captureLogs();
        new EcMap(f.ec, f.ec2pathway, f.ec2module, f.ec2ko, f.ec2reaction);

        expect(logs).toEqual([]);
    });

    it('applies the link instead of warning when the id resolves in the second column too', () => {
        // The mirror of KoMap's ec2ko case above: same handler, same column,
        // but the KO number exists. The description here deliberately carries
        // no [EC:...] suffix, so the EC number on the entry can only have come
        // from the link file.
        const f = files('resolved-ko', {
            ko: 'K00001\tadh; alcohol dehydrogenase\n',
            ko2pathway: 'K00001\tmap00010\n',
            ko2module: 'K00001\tM00001\n',
            ec2ko: '1.1.1.1\tK00001\n',
            ko2reaction: 'K00001\tR00623\n',
        });

        const logs = captureLogs();
        const koMap = new KoMap(f.ko, f.ko2pathway, f.ko2module, f.ec2ko, f.ko2reaction);

        expect(logs).toEqual([]);
        expect(koMap.get('K00001')?.ecNumbers).toEqual(['1.1.1.1']);
    });
});
