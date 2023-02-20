import ReaderMap from './ReaderMap';
import pathwayMap from './PathwayMap';
import { KeggMap } from '../models/annotations/KeggMap';

// TODO: Replaces could be done on fetch once a day
// TODO: Then also throw out path:ko or path:ec from the file
// TODO: So much duplicate code, refactor
// TODO: Put file locations in config file

export type CompoundKey = string;

export type CompoundValue = {
    name: string;
    pathways: KeggMap[];
    ecNumbers: string[];
    reactionIds: string[];
};

class CompoundMap extends ReaderMap<CompoundKey, CompoundValue> {
    constructor(
        descriptionFile: string = '../../data/compound',
        pathwayLinkFile: string = '../../data/link/compound2pathway',
        ecLinkFile: string = '../../data/link/ec2compound',
        reactionLinkFile: string = '../../data/link/reaction2compound'
    ) {
        super();

        this.handleDescriptionFile(descriptionFile);
        this.handlePathwayLinkFile(pathwayLinkFile);
        this.handleEcLinkFile(ecLinkFile);
        this.handleReactionLinkFile(reactionLinkFile);
    }

    private handleDescriptionFile(descriptionFile: string) {
        this.readlines(descriptionFile, (line: string) => {
            const [ compoundId, description ] = line.split('\t');

            this.set(compoundId.replace('cpd:', ''), { 
                name: description.trim(),
                pathways: [], 
                ecNumbers: [],
                reactionIds: []
            });
        });
    }

    private handlePathwayLinkFile(pathwayLinkFile: string) {
        this.readlines(pathwayLinkFile, (line: string) => {
            const [ pathwayId, compoundId ] = line.split('\t');

            const compound = this.get(compoundId.replace('cpd:', ''));
            const trimmedId = pathwayId.replace('path:', '');
            if (compound && !compound.pathways.map(p => p.id).includes(trimmedId)) {
                const pathway = pathwayMap.get(trimmedId);
                compound.pathways.push({ id: trimmedId, name: pathway?.name ?? '' });
            } else {
                // TODO: add logging or error handling or add without description
                console.log(`Compound id ${compoundId.replace('cpd:', '')} not found`);
            }
        });
    }

    private handleEcLinkFile(ecLinkFile: string) {
        this.readlines(ecLinkFile, (line: string) => {
            const [ ecNumber, compoundId ] = line.split('\t');

            const compound = this.get(compoundId.replace('cpd:', ''));
            if (compound && !compound.ecNumbers.includes(ecNumber.replace('ec:', ''))) {
                compound.ecNumbers.push(ecNumber.replace('ec:', ''));
            } else {
                // TODO: add logging or error handling or add without description
                console.log(`Compound id ${compoundId.replace('cpd:', '')} not found`);
            }
        });
    }

    private handleReactionLinkFile(reactionLinkFile: string) {
        this.readlines(reactionLinkFile, (line: string) => {
            const [ reactionId, compoundId ] = line.split('\t');

            const compound = this.get(compoundId.replace('cpd:', ''));
            if (compound && !compound.reactionIds.includes(reactionId.replace('rn:', ''))) {
                compound.reactionIds.push(reactionId.replace('rn:', ''));
            } else {
                // TODO: add logging or error handling or add without description
                console.log(`Compound id ${compoundId.replace('cpd:', '')} not found`);
            }
        });
    }
};

export default new CompoundMap();
