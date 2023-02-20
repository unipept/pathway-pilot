import ReaderMap from './ReaderMap';

// TODO: Replaces could be done on fetch once a day
// TODO: Then also throw out path:ko or path:ec from the file
// TODO: So much duplicate code, refactor
// TODO: Put file locations in config file

const descriptionEcRegex: RegExp = /\[EC:([^\]]+)\]$/;

export type KoKey = string;

export type KoValue = {
    name: string;
    pathways: string[];
    ecNumbers: string[];
    reactionIds: string[];
};

export class KoMap extends ReaderMap<KoKey, KoValue> {
    constructor(
        descriptionFile: string = '../../data/ko', 
        pathwayLinkFile: string = '../../data/link/ko2pathway', 
        ecLinkFile: string = '../../data/link/ec2ko',
        reactionLinkFile: string = '../../data/link/ko2reaction'
    ) {
        super();

        this.handleDescriptionFile(descriptionFile);
        this.handlePathwayLinkFile(pathwayLinkFile);
        this.handleEcLinkFile(ecLinkFile);
        this.handleReactionLinkFile(reactionLinkFile);
    }

    private handleDescriptionFile(descriptionFile: string) {
        this.readlines(descriptionFile, (line: string) => {
            const [ koNumber, description ] = line.split('\t');

            const ecNumbers = description.match(descriptionEcRegex)?.[1]?.split(' ');

            this.set(koNumber.replace('ko:', ''), { 
                name: description.trim(),
                pathways: [], 
                ecNumbers: ecNumbers ?? [],
                reactionIds: []
            });
        });
    }

    private handlePathwayLinkFile(pathwayLinkFile: string) {
        this.readlines(pathwayLinkFile, (line: string) => {
            const [ koNumber, pathwayId ] = line.split('\t');

            const ko = this.get(koNumber.replace('ko:', ''));
            if (ko && !ko.pathways.includes(pathwayId.replace('path:', ''))) {
                ko.pathways.push(pathwayId.replace('path:', ''));
            } else {
                // TODO: add logging or error handling or add without description
                console.log(`KO number ${koNumber.replace('ko:', '')} not found`);
            }
        });
    }

    private handleEcLinkFile(ecLinkFile: string) {
        this.readlines(ecLinkFile, (line: string) => {
            const [ ecNumber, koNumber ] = line.split('\t');

            const ko = this.get(koNumber.replace('ko:', ''));
            if (ko && !ko.ecNumbers.includes(ecNumber.replace('ec:', ''))) {
                ko.ecNumbers.push(ecNumber.replace('ec:', ''));
            } else {
                // TODO: add logging or error handling or add without description
                console.log(`KO number ${koNumber.replace('ko:', '')} not found`);
            }
        });
    }

    private handleReactionLinkFile(reactionLinkFile: string) {
        this.readlines(reactionLinkFile, (line: string) => {
            const [ koNumber, reactionId ] = line.split('\t');

            const ko = this.get(koNumber.replace('ko:', ''));
            if (ko && !ko.reactionIds.includes(reactionId.replace('rn:', ''))) {
                ko.reactionIds.push(reactionId.replace('rn:', ''));
            } else {
                // TODO: add logging or error handling or add without description
                console.log(`KO number ${koNumber.replace('ko:', '')} not found`);
            }
        });
    }
};

export default new KoMap();
