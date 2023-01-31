import fs from 'fs';
import readline from 'readline';

export type PathwayKey = string;

export type PathwayValue = string;

export class PathwayMap {
    private readonly pathwayMap: Map<PathwayKey, PathwayValue>

    constructor() { this.pathwayMap = new Map<PathwayKey, PathwayValue>(); }

    public add(pathwayId: PathwayKey, value: PathwayValue): void {
        this.pathwayMap.set(pathwayId, value);
    }

    public get(pathwayId: PathwayKey): PathwayValue | undefined {
        return this.pathwayMap.get(pathwayId);
    }

    public async fromPathwayMapFile(file: string): Promise<void> {
        const fileStream = fs.createReadStream(file);

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (const line of rl) {
            const [ pathwayId, name ] = line.split('\t')

            this.add(pathwayId.slice(5), name.trim())
        }
    }

    // TODO: Add the option to create this map from a URL
    // Then a saved file can be the backup in case of a failed request
}
