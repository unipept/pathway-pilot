import ReaderMap from './ReaderMap';

// TODO: Replaces could be done on fetch once a day
// TODO: Then also throw out path:ko or path:ec from the file
// TODO: So much duplicate code, refactor
// TODO: Put file locations in config file

export type EcKey = string;

export type EcValue = {
    name: string;
    pathways: string[];
    koNumbers: string[];
};

class EcMap extends ReaderMap<EcKey, EcValue> {
    constructor() {
        super();
    }

    public async setup() {
        await this.setupName();
        await this.setupPathways();
        await this.setupKoNumbers();

        return this;
    }

    private async setupName() {
        await this.readlines('../../data/ec', (line: string) => {
            const [ ecNumber, name ] = line.split('\t');

            this.set(ecNumber.replace('ec:', ''), { 
                name: name.trim(),
                pathways: [], 
                koNumbers: [] 
            });
        });
    }

    private async setupPathways() {
        await this.readlines('../../data/link/ec2pathway', (line: string) => {
            const [ ecNumber, pathwayId ] = line.split('\t');

            if (pathwayId.startsWith('path:ec')) {
                return;
            }

            const ec = this.get(ecNumber.replace('ec:', ''));
            if (ec && !ec.pathways.includes(pathwayId.replace('path:', ''))) {
                ec.pathways.push(pathwayId.replace('path:', ''));
            } else {
                // TODO: add logging or error handling
                console.log(`EC number ${ec} not found`);
            }
        });
    }

    private async setupKoNumbers() {
        await this.readlines('../../data/link/ec2ko', (line: string) => {
            const [ ecNumber, koNumber ] = line.split('\t');

            const ec = this.get(ecNumber.replace('ec:', ''));
            if (ec && !ec.koNumbers.includes(koNumber.replace('ko:', ''))) {
                ec.koNumbers.push(koNumber.replace('ko:', ''));
            } else {
                // TODO: add logging or error handling
                console.log(`EC number ${ec} not found`);
            }
        });
    }
};

export const buildEcMap = async () => {
    return await new EcMap().setup();
};
