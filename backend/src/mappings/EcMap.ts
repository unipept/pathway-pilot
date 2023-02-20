import ReaderMap from './ReaderMap';
import pathwayMap from './PathwayMap';
import { KeggMap } from '../models/annotations/KeggMap';

// TODO: Replaces could be done on fetch once a day
// TODO: Then also throw out path:ko or path:ec from the file
// TODO: So much duplicate code, refactor
// TODO: Put file locations in config file

export type EcKey = string;

export type EcValue = {
    name: string;
    pathways: KeggMap[];
    koNumbers: string[];
    reactionIds: string[];
};

class EcMap extends ReaderMap<EcKey, EcValue> {
    constructor(
        descriptionFile: string = '../../data/ec',
        pathwayLinkFile: string = '../../data/link/ec2pathway',
        koLinkFile: string = '../../data/link/ec2ko',
        reactionLinkFile: string = '../../data/link/ec2reaction'
    ) {
        super();

        this.handleDescriptionFile(descriptionFile);
        this.handlePathwayLinkFile(pathwayLinkFile);
        this.handleKoLinkFile(koLinkFile);
        this.handleReactionLinkFile(reactionLinkFile);
    }

    private handleDescriptionFile(descriptionFile: string) {
        this.readlines(descriptionFile, (line: string) => {
            const [ ecNumber, description ] = line.split('\t');

            this.set(ecNumber.replace('ec:', ''), { 
                name: description.trim(),
                pathways: [], 
                koNumbers: [],
                reactionIds: []
            });
        });
    }

    private handlePathwayLinkFile(pathwayLinkFile: string) {
        this.readlines(pathwayLinkFile, (line: string) => {
            const [ ecNumber, pathwayId ] = line.split('\t');

            const ec = this.get(ecNumber.replace('ec:', ''));
            const trimmedId = pathwayId.replace('path:', '');
            if (ec && !ec.pathways.map(p => p.id).includes(trimmedId)) {
                const pathway = pathwayMap.get(trimmedId);
                ec.pathways.push({ id: trimmedId, name: pathway?.name ?? '' });
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

    private handleReactionLinkFile(reactionLinkFile: string) {
        this.readlines(reactionLinkFile, (line: string) => {
            const [ ecNumber, reactionId ] = line.split('\t');

            const ec = this.get(ecNumber.replace('ec:', ''));
            if (ec && !ec.reactionIds.includes(reactionId.replace('rn:', ''))) {
                ec.reactionIds.push(reactionId.replace('rn:', ''));
            } else {
                // TODO: add logging or error handling or add without description
                console.log(`EC number ${ecNumber.replace('ec:', '')} not found`);
            }
        });
    }
};

export default new EcMap();
