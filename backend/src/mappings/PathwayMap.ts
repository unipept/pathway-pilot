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
    constructor(
        descriptionFile: string = '../../data/pathway',
        ecLinkFile: string = '../../data/link/ec2pathway',
        koLinkFile: string = '../../data/link/ko2pathway'
    ) {
        super();

        this.handleDescriptionFile(descriptionFile);
        this.handleEcLinkFile(ecLinkFile);
        this.handleKoLinkFile(koLinkFile);
    }

    private handleDescriptionFile(descriptionFile: string) {
        this.readlines(descriptionFile, (line: string) => {
            const [ pathwayId, description ] = line.split('\t');

            this.set(pathwayId.replace('path:', ''), { 
                name: description.trim(),
                ecNumbers: [],
                koNumbers: []
            });
        });
    }

    private handleEcLinkFile(ecLinkFile: string) {
        this.readlines(ecLinkFile, (line: string) => {
            const [ ecNumber, pathwayId ] = line.split('\t');

            const pathway = this.get(pathwayId.replace('path:', ''));
            if (pathway && !pathway.ecNumbers.includes(ecNumber.replace('ec:', ''))) {
                pathway.ecNumbers.push(ecNumber.replace('ec:', ''));
            } else {
                // TODO: add logging or error handling
                console.log(`Pathway ${pathwayId} not found`);
            }
        });
    }

    private handleKoLinkFile(koLinkFile: string) {
        this.readlines(koLinkFile, (line: string) => {
            const [ koNumber, pathwayId ] = line.split('\t');

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

export default new PathwayMap();
