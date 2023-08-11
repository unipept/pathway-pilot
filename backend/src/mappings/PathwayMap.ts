import ReaderMap from "./ReaderMap";
import config from "../config/config";

import categoryMap from "./pathway/CategoryMap";

// TODO: Replaces could be done on fetch once a day
// TODO: Then also throw out path:ko or path:ec from the file
// TODO: So much duplicate code, refactor
// TODO: Put file locations in config file

export type PathwayKey = string;

export type PathwayValue = {
    name: string;
    category: string;
    subCategory: string;
    ecNumbers: string[];
    koNumbers: string[];
    reactionIds: string[];
    compoundIds: string[];
};

export class PathwayMap extends ReaderMap<PathwayKey, PathwayValue> {
    constructor(
        descriptionFile: string  = config.pathwayDataFile,
        ecLinkFile: string       = config.ecPathwayLinkFile,
        koLinkFile: string       = config.koPathwayLinkFile,
        reactionLinkFile: string = config.reactionPathwayLinkFile,
        compoundLinkFile: string = config.compoundPathwayLinkFile,
    ) {
        super();

        this.handleDescriptionFile(descriptionFile);
        this.handleEcLinkFile(ecLinkFile);
        this.handleKoLinkFile(koLinkFile);
        this.handleReactionLinkFile(reactionLinkFile);
        this.handleCompoundLinkFile(compoundLinkFile);
    }

    private handleDescriptionFile(descriptionFile: string) {
        this.readlines(descriptionFile, (line: string) => {
            const [ pathwayId, description ] = line.split('\t');
            console.log(pathwayId);
            const [ category, subCategory ] = categoryMap.get(pathwayId) ?? [ "Unknown", "Unknown" ];

            this.set(pathwayId, { 
                name: description.trim(),
                category: category,
                subCategory: subCategory,
                ecNumbers: [],
                koNumbers: [],
                reactionIds: [],
                compoundIds: []
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

    private handleCompoundLinkFile(compoundLinkFile: string) {
        this.readlines(compoundLinkFile, (line: string) => {
            const [ compoundId, pathwayId ] = line.split('\t');

            const pathway = this.get(pathwayId);
            if (pathway && !pathway.compoundIds.includes(compoundId)) {
                pathway.compoundIds.push(compoundId);
            } else {
                // TODO: add logging or error handling
                console.log(`Pathway ${pathwayId} not found`);
            }
        });
    }
}

export default new PathwayMap();
