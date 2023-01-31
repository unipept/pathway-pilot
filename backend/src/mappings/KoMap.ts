import fs from 'fs';
import readline from 'readline';

export type KoMapKey = string;

export type KoMapValue = { 
    symbols: string[],
    name: string,
    ecNumbers: string[]
};

export class KoMap {
    private readonly koMap: Map<KoMapKey, KoMapValue>

    private ecRegex: RegExp = /\[[^\]]*\]/;

    constructor() { this.koMap = new Map<KoMapKey, KoMapValue>(); }

    public addKoNumber(koNumber: KoMapKey, value: KoMapValue): void {
        this.koMap.set(koNumber, value);
    }

    public get(koNumber: KoMapKey) {
        return this.koMap.get(koNumber);
    }

    public async fromKoMapFile(file: string): Promise<void> {
        const fileStream = fs.createReadStream(file);

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (const line of rl) {
            const [ koNumber, information ] = line.split('\t');
            let [ symbolString, name ] = information.split(';');

            if (!name) {
                name = symbolString;
            }

            this.addKoNumber(koNumber, { 
                symbols: symbolString.split(',').map(symbol => symbol.trim()),
                name: name.trim(),
                ecNumbers: this.ecRegex.exec(name.trim())?.[0].slice(1, -1).split(' ').map(ecNumber => ecNumber.trim().slice(3)) ?? []
            });
        }
    }

    // TODO: Add the option to create this map from a URL
    // Then a saved file can be the backup in case of a failed request
};
