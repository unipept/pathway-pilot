import path from "path";

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
            if (!pathway) {
                console.log(`Pathway ${pathwayId} not found (${path.basename(ecLinkFile)})`);
            } else if (!pathway.ecNumbers.includes(ecNumber)) {
                pathway.ecNumbers.push(ecNumber);
            }
        });
    }

    private handleKoLinkFile(koLinkFile: string) {
        this.readlines(koLinkFile, (line: string) => {
            const [ koNumber, pathwayId ] = line.split('\t');

            const pathway = this.get(pathwayId);
            if (!pathway) {
                console.log(`Pathway ${pathwayId} not found (${path.basename(koLinkFile)})`);
            } else if (!pathway.koNumbers.includes(koNumber)) {
                pathway.koNumbers.push(koNumber);
            }
        });
    }

    private handleReactionLinkFile(reactionLinkFile: string) {
        this.readlines(reactionLinkFile, (line: string) => {
            const [ reactionId, pathwayId ] = line.split('\t');

            const pathway = this.get(pathwayId);
            if (!pathway) {
                console.log(`Pathway ${pathwayId} not found (${path.basename(reactionLinkFile)})`);
            } else if (!pathway.reactionIds.includes(reactionId)) {
                pathway.reactionIds.push(reactionId);
            }
        });
    }

    private handleCompoundLinkFile(compoundLinkFile: string) {
        this.readlines(compoundLinkFile, (line: string) => {
            const [ compoundId, pathwayId ] = line.split('\t');

            const pathway = this.get(pathwayId);
            if (!pathway) {
                console.log(`Pathway ${pathwayId} not found (${path.basename(compoundLinkFile)})`);
            } else if (!pathway.compoundIds.includes(compoundId)) {
                pathway.compoundIds.push(compoundId);
            }
        });
    }
}

export default new PathwayMap();
