import ReaderMap from './ReaderMap';
import pathwayMap from './PathwayMap';
import moduleMap from './ModuleMap';
import { KeggMap } from '../models/annotations/KeggMap';
import { KeggModule } from '../models/annotations/KeggModule';

// TODO: Replaces could be done on fetch once a day
// TODO: Then also throw out path:ko or path:ec from the file
// TODO: So much duplicate code, refactor
// TODO: Put file locations in config file

export type ReactionKey = string;

export type ReactionValue = {
    names: string[];
    pathways: KeggMap[];
    modules: KeggModule[];
    ecNumbers: string[];
};

class ReactionMap extends ReaderMap<ReactionKey, ReactionValue> {
    constructor(
        descriptionFile: string = '../../data/reaction',
        pathwayLinkFile: string = '../../data/link/reaction2pathway',
        moduleLinkFile: string = '../../data/link/reaction2module',
        ecLinkFile: string = '../../data/link/ec2reaction'
    ) {
        super();

        this.handleDescriptionFile(descriptionFile);
        this.handlePathwayLinkFile(pathwayLinkFile);
        this.handleModuleLinkFile(moduleLinkFile);
        this.handleEcLinkFile(ecLinkFile);
    }

    private handleDescriptionFile(descriptionFile: string) {
        this.readlines(descriptionFile, (line: string) => {
            const [ reactionId, description ] = line.split('\t');

            this.set(reactionId.replace('rn:', ''), { 
                names: description
                    .trim()
                    .split(';')
                    .map((n: string) => n.trim())
                    .filter((n: string) => n.length),
                pathways: [], 
                modules: [],
                ecNumbers: []
            });
        });
    }

    private handlePathwayLinkFile(pathwayLinkFile: string) {
        this.readlines(pathwayLinkFile, (line: string) => {
            const [ reactionId, pathwayId ] = line.split('\t');

            const reaction = this.get(reactionId.replace('rn:', ''));
            const trimmedId = pathwayId.replace('path:', '');
            if (reaction && !reaction.pathways.map(p => p.id).includes(trimmedId)) {
                const pathway = pathwayMap.get(trimmedId);
                reaction.pathways.push({ id: trimmedId, name: pathway?.name ?? '' });
            } else {
                // TODO: add logging or error handling or add without description
                console.log(`Reaction id ${reactionId.replace('rn:', '')} not found`);
            }
        });
    }

    private handleModuleLinkFile(moduleLinkFile: string) {
        this.readlines(moduleLinkFile, (line: string) => {
            const [ reactionId, moduleId ] = line.split('\t');

            const reaction = this.get(reactionId.replace('rn:', ''));
            const trimmedId = moduleId.replace('md:', '');
            if (reaction && !reaction.modules.map(m => m.id).includes(trimmedId)) {
                const module = moduleMap.get(trimmedId);
                reaction.modules.push({ id: trimmedId, name: module?.name ?? '' });
            } else {
                // TODO: add logging or error handling or add without description
                console.log(`Reaction id ${reactionId.replace('rn:', '')} not found`);
            }
        });
    }

    private handleEcLinkFile(ecLinkFile: string) {
        this.readlines(ecLinkFile, (line: string) => {
            const [ ecNumber, reactionId ] = line.split('\t');

            const reaction = this.get(reactionId.replace('rn:', ''));
            if (reaction && !reaction.ecNumbers.includes(ecNumber.replace('ec:', ''))) {
                reaction.ecNumbers.push(ecNumber.replace('ec:', ''));
            } else {
                // TODO: add logging or error handling or add without description
                console.log(`Reaction id ${reactionId.replace('rn:', '')} not found`);
            }
        });
    }
};

export default new ReactionMap();
