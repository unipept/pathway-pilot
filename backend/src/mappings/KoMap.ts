import ReaderMap from './ReaderMap';

// TODO: Replaces could be done on fetch once a day
// TODO: Then also throw out path:ko or path:ec from the file
// TODO: So much duplicate code, refactor
// TODO: Put file locations in config file

export type KoKey = string;

export type KoValue = {
    name: string;
    pathways: string[];
    ecNumbers: string[];
};

export class KoMap extends ReaderMap<KoKey, KoValue> {
    constructor() {
        super();
    }

    public async setup() {
        await this.setupName();
        await this.setupPathways();
        await this.setupEcNumbers();

        return this;
    }

    private async setupName() {
        await this.readlines('../../data/ko', (line: string) => {
            const [ koNumber, name ] = line.split('\t');

            this.set(koNumber.replace('ko:', ''), { 
                name: name.trim(),
                pathways: [], 
                ecNumbers: [] 
            });
        });
    }

    private async setupPathways() {
        await this.readlines('../../data/link/ko2pathway', (line: string) => {
            const [ koNumber, pathwayId ] = line.split('\t');

            if (pathwayId.startsWith('path:ko')) {
                return;
            }

            const ko = this.get(koNumber.replace('ko:', ''));
            if (ko && !ko.pathways.includes(pathwayId.replace('path:', ''))) {
                ko.pathways.push(pathwayId.replace('path:', ''));
            } else {
                // TODO: add logging or error handling
                console.log(`KO number ${ko} not found`);
            }
        });
    }

    private async setupEcNumbers() {
        await this.readlines('../../data/link/ko2ec', (line: string) => {
            const [ koNumber, ecNumber ] = line.split('\t');

            const ko = this.get(koNumber.replace('ko:', ''));
            if (ko && !ko.ecNumbers.includes(ecNumber.replace('ec:', ''))) {
                ko.ecNumbers.push(ecNumber.replace('ec:', ''));
            } else {
                // TODO: add logging or error handling
                console.log(`KO number ${ko} not found`);
            }
        });
    }
};

export const buildKoMap = async () => {
    return await new KoMap().setup();
};
