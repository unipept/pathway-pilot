import fs from 'fs';
import path from 'path';
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

    public static async fromPathwayMapFile(file: string): Promise<PathwayMap> {
        const map = new PathwayMap();
        
        const fileStream = fs.createReadStream(path.join(__dirname, file));

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (const line of rl) {
            const [ pathwayId, name ] = line.split('\t')

            map.add(pathwayId.slice(5), name.trim())
        }

        return map;
    }

    // TODO: Add the option to create this map from a URL
    // Then a saved file can be the backup in case of a failed request

    public toJson(): { [key: string]: string } {
        return Object.fromEntries(this.pathwayMap);
    }
}
