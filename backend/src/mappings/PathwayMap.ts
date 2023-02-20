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
    reactionIds: string[];
};

export class PathwayMap extends ReaderMap<PathwayKey, PathwayValue> {
    constructor(
        descriptionFile: string = '../../data/pathway',
        ecLinkFile: string = '../../data/link/ec2pathway',
        koLinkFile: string = '../../data/link/ko2pathway',
        reactionLinkFile: string = '../../data/link/reaction2pathway'
    ) {
        super();

        this.handleDescriptionFile(descriptionFile);
        this.handleEcLinkFile(ecLinkFile);
        this.handleKoLinkFile(koLinkFile);
        this.handleReactionLinkFile(reactionLinkFile);
    }

    private handleDescriptionFile(descriptionFile: string) {
        this.readlines(descriptionFile, (line: string) => {
            const [ pathwayId, description ] = line.split('\t');

            this.set(pathwayId.replace('path:', ''), { 
                name: description.trim(),
                ecNumbers: [],
                koNumbers: [],
                reactionIds: []
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

    private handleReactionLinkFile(reactionLinkFile: string) {
        this.readlines(reactionLinkFile, (line: string) => {
            const [ reactionId, pathwayId ] = line.split('\t');

            const pathway = this.get(pathwayId.replace('path:', ''));
            if (pathway && !pathway.reactionIds.includes(reactionId.replace('rn:', ''))) {
                pathway.reactionIds.push(reactionId.replace('rn:', ''));
            } else {
                 // TODO: add logging or error handling
                 console.log(`Pathway ${pathwayId} not found`);
            }
        });
    }
}

export default new PathwayMap();
