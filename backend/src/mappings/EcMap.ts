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
    constructor(
        descriptionFile: string = '../../data/ec',
        pathwayLinkFile: string = '../../data/link/ec2pathway',
        koLinkFile: string = '../../data/link/ec2ko'
    ) {
        super();

        this.handleDescriptionFile(descriptionFile);
        this.handlePathwayLinkFile(pathwayLinkFile);
        this.handleKoLinkFile(koLinkFile);
    }

    private handleDescriptionFile(descriptionFile: string) {
        this.readlines(descriptionFile, (line: string) => {
            const [ ecNumber, description ] = line.split('\t');

            this.set(ecNumber.replace('ec:', ''), { 
                name: description.trim(),
                pathways: [], 
                koNumbers: [] 
            });
        });
    }

    private handlePathwayLinkFile(pathwayLinkFile: string) {
        this.readlines(pathwayLinkFile, (line: string) => {
            const [ ecNumber, pathwayId ] = line.split('\t');

            const ec = this.get(ecNumber.replace('ec:', ''));
            if (ec && !ec.pathways.includes(pathwayId.replace('path:', ''))) {
                ec.pathways.push(pathwayId.replace('path:', ''));
            } else {
                // TODO: add logging or error handling or add without description
                console.log(`EC number ${ecNumber.replace('ec:', '')} not found`);
            }
        });
    }

    private handleKoLinkFile(koLinkFile: string) {
        this.readlines(koLinkFile, (line: string) => {
            const [ ecNumber, koNumber ] = line.split('\t');

            const ec = this.get(ecNumber.replace('ec:', ''));
            if (ec && !ec.koNumbers.includes(koNumber.replace('ko:', ''))) {
                ec.koNumbers.push(koNumber.replace('ko:', ''));
            } else {
                // TODO: add logging or error handling or add without description
                console.log(`EC number ${ecNumber.replace('ec:', '')} not found`);
            }
        });
    }
};

export default new EcMap();
