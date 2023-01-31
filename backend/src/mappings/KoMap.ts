import fs from 'fs';
import path from 'path';
import readline from 'readline';

const ecRegex: RegExp = /\[[^\]]*\]/;   /* Regex for EC numbers */

export type KoMapKey = string;

export type KoMapValue = { 
    symbols: string[],
    name: string,
    ecNumbers: string[]
};

export class KoMap {
    private readonly koMap: Map<KoMapKey, KoMapValue>

    constructor() { this.koMap = new Map<KoMapKey, KoMapValue>(); }

    /**
     * Adds a new entry to the koMap
     * 
     * @param koNumber  The koNumber of the entry 
     * @param value     The value of the entry
     */
    public add(koNumber: KoMapKey, value: KoMapValue): void {
        this.koMap.set(koNumber, value);
    }

    /**
     * Returns the value of the given koNumber
     * 
     * @param koNumber  The koNumber of the entry
     * @returns         The value of the entry
     */
    public get(koNumber: KoMapKey): KoMapValue | undefined {
        return this.koMap.get(koNumber);
    }

    /**
     * Initializes the koMap from a file
     * 
     * @param file  The file to read from
     * @returns     A promise that resolves when the map is initialized
     */
    public static async fromKoMapFile(file: string): Promise<KoMap> {
        const map = new KoMap();

        const fileStream = fs.createReadStream(path.join(__dirname, file));

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

            map.add(koNumber.replace('ko:', ''), { 
                symbols: symbolString.split(',').map(symbol => symbol.trim()),
                name: name.trim(),
                ecNumbers: ecRegex.exec(name.trim())?.[0].slice(1, -1).split(' ').map(ecNumber => ecNumber.trim().replace('EC:', '')) ?? []
            });
        }

        return map;
    }

    // TODO: Add the option to create this map from a URL
    // Then a saved file can be the backup in case of a failed request

    public toJson(): { [key: string]: KoMapValue } {
        return Object.fromEntries(this.koMap);
    }
};
