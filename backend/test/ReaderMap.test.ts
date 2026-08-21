import { afterAll, describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';

import ReaderMap from '../src/mappings/ReaderMap';

describe('ReaderMap#readlines', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'reader-map-'));

    afterAll(() => {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    const writeFile = (name: string, content: string) => {
        const file = path.join(tmpDir, name);
        fs.writeFileSync(file, content);
        return file;
    };

    it('passes each line to the callback in order', () => {
        const file = writeFile('multi-line.txt', 'first\nsecond\nthird');
        const map = new ReaderMap<string, string>();
        const lines: string[] = [];

        map.readlines(file, (line) => lines.push(line));

        expect(lines).toEqual(['first', 'second', 'third']);
    });

    it('does not pass an empty final line for a file with a trailing newline', () => {
        // This is what the .trim() in readlines buys: without it, splitting
        // "first\nsecond\n" on '\n' would yield a trailing ''.
        const file = writeFile('trailing-newline.txt', 'first\nsecond\n');
        const map = new ReaderMap<string, string>();
        const lines: string[] = [];

        map.readlines(file, (line) => lines.push(line));

        expect(lines).toEqual(['first', 'second']);
    });

    it('handles a single line with no trailing newline', () => {
        const file = writeFile('single-line.txt', 'only');
        const map = new ReaderMap<string, string>();
        const lines: string[] = [];

        map.readlines(file, (line) => lines.push(line));

        expect(lines).toEqual(['only']);
    });

    it('leaves tab-separated content unsplit for the callback to split', () => {
        const file = writeFile('tabs.txt', 'a\tb\tc');
        const map = new ReaderMap<string, string>();
        const lines: string[] = [];

        map.readlines(file, (line) => lines.push(line));

        expect(lines).toEqual(['a\tb\tc']);
    });

    it('yields a single empty-string line for an empty file (current behaviour, not a guarantee)', () => {
        // ''.trim().split('\n') is ['']. This surprising case exists because
        // readlines() doesn't special-case an empty file; it's asserted here
        // as documentation of the current behaviour rather than an assertion
        // that it's desirable.
        const file = writeFile('empty.txt', '');
        const map = new ReaderMap<string, string>();
        const lines: string[] = [];

        map.readlines(file, (line) => lines.push(line));

        expect(lines).toEqual(['']);
    });
});
