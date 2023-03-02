import ReaderMap from "./ReaderMap";
import config from "../config/config";

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
        descriptionFile: string  = config.pathwayDataFile,
        ecLinkFile: string       = config.ecPathwayLinkFile,
        koLinkFile: string       = config.koPathwayLinkFile,
        reactionLinkFile: string = config.reactionPathwayLinkFile
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

            this.set(pathwayId, { 
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

            const pathway = this.get(pathwayId);
            if (pathway && !pathway.ecNumbers.includes(ecNumber)) {
                pathway.ecNumbers.push(ecNumber);
            } else {
                // TODO: add logging or error handling
                console.log(`Pathway ${pathwayId} not found`);
            }
        });
    }

    private handleKoLinkFile(koLinkFile: string) {
        this.readlines(koLinkFile, (line: string) => {
            const [ koNumber, pathwayId ] = line.split('\t');

            const pathway = this.get(pathwayId);
            if (pathway && !pathway.koNumbers.includes(koNumber)) {
                pathway.koNumbers.push(koNumber);
            } else {
                // TODO: add logging or error handling
                console.log(`Pathway ${pathwayId} not found`);
            }
        });
    }

    private handleReactionLinkFile(reactionLinkFile: string) {
        this.readlines(reactionLinkFile, (line: string) => {
            const [ reactionId, pathwayId ] = line.split('\t');

            const pathway = this.get(pathwayId);
            if (pathway && !pathway.reactionIds.includes(reactionId)) {
                pathway.reactionIds.push(reactionId);
            } else {
                 // TODO: add logging or error handling
                 console.log(`Pathway ${pathwayId} not found`);
            }
        });
    }
}

export default new PathwayMap();
