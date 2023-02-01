import { KeyObject } from 'crypto';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

export default class ReaderMap<Key, Value> extends Map<Key, Value> {
    constructor() {
        super();
    }

    async readlines(file: string, callback: (line: string) => void) {
        const fileStream = fs.createReadStream(path.join(__dirname, file));

        const lines = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

        for await (const line of lines) {
            callback(line);
        }
    }
};
