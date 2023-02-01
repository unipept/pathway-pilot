import ReaderMap from "./ReaderMap";

// TODO: Replaces could be done on fetch once a day
// TODO: Then also throw out path:ko or path:ec from the file
// TODO: So much duplicate code, refactor
// TODO: Put file locations in config file

export type PathwayKey = string;

export type PathwayValue = {
    name: string;
    ecNumbers: string[];
    koNumbers: string[];
};

export class PathwayMap extends ReaderMap<PathwayKey, PathwayValue> {
    constructor() {
        super();
    }

    public async setup() {
        await this.setupName();
        await this.setupEcNumbers();
        await this.setupKoNumbers();

        return this;
    }

    private async setupName() {
        await this.readlines('../../data/pathway', (line: string) => {
            const [ pathwayId, name ] = line.split('\t');

            this.set(pathwayId.replace('path:', ''), { 
                name: name.trim(), 
                ecNumbers: [], 
                koNumbers: [] 
            });
        });
    }

    private async setupEcNumbers() {
        await this.readlines('../../data/link/pathway2ec', (line: string) => {
            const [ pathwayId, ecNumber ] = line.split('\t');

            if (pathwayId.startsWith('path:ec')) {
                return;
            }

            const pathway = this.get(pathwayId.replace('path:', ''));
            if (pathway && !pathway.ecNumbers.includes(ecNumber.replace('ec:', ''))) {
                pathway.ecNumbers.push(ecNumber.replace('ec:', ''));
            } else {
                // TODO: add logging or error handling
                console.log(`Pathway ${pathwayId} not found`);
            }
        });
    }

    private async setupKoNumbers() {
        await this.readlines('../../data/link/pathway2ko', (line: string) => {
            const [ pathwayId, koNumber ] = line.split('\t');

            if (pathwayId.startsWith('path:ko')) {
                return;
            }

            const pathway = this.get(pathwayId.replace('path:', ''));
            if (pathway && !pathway.koNumbers.includes(koNumber.replace('ko:', ''))) {
                pathway.koNumbers.push(koNumber.replace('ko:', ''));
            } else {
                // TODO: add logging or error handling
                console.log(`Pathway ${pathwayId} not found`);
            }
        });
    }
}

export const buildPathwayMap = async () => {
    return await new PathwayMap().setup();
};
