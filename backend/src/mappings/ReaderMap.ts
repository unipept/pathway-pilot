import fs from 'fs';
import path from 'path';

export default class ReaderMap<Key, Value> extends Map<Key, Value> {
    constructor() {
        super();
    }

    readlines(file: string, callback: (line: string) => void) {
        fs.readFileSync(path.join(__dirname, file), 'utf-8')
            .trim()
            .split('\n')
            .forEach((line) => callback(line));
    }
};
