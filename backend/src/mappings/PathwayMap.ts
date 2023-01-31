import fs from 'fs';
import path from 'path';
import readline from 'readline';

export type PathwayKey = string;

export type PathwayValue = string;

export class PathwayMap {
    constructor(
        private readonly pathwayMap: Map<PathwayKey, PathwayValue> = new Map()
    ) {}

    /**
     * Adds a new entry to the pathwayMap
     * 
     * @param pathwayId The pathwayId of the entry 
     * @param value     The value of the entry
     */
    public add(pathwayId: PathwayKey, value: PathwayValue): void {
        this.pathwayMap.set(pathwayId, value);
    }

    /**
     * Returns the value of the given pathwayId
     * 
     * @param pathwayId The pathwayId of the entry
     * @returns         The value of the entry
     */
    public get(pathwayId: PathwayKey): PathwayValue | undefined {
        return this.pathwayMap.get(pathwayId);
    }

    /**
     * Initializes the pathwayMap from a file
     * 
     * @param file  The file to read from
     * @returns     A promise that resolves when the map is initialized
     */
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

    /**
     * Converts the pathwayMap to a JSON object
     * 
     * @returns The JSON object
     */
    public toJson(): { [key: string]: string } {
        return Object.fromEntries(this.pathwayMap);
    }
}
