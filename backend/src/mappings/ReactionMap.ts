import path from 'path';

import ReaderMap from './ReaderMap';
import pathwayMap from './PathwayMap';
import moduleMap from './ModuleMap';
import { KeggMap } from '../models/annotations/KeggMap';
import { KeggModule } from '../models/annotations/KeggModule';
import config from '../config/config';

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

export class ReactionMap extends ReaderMap<ReactionKey, ReactionValue> {
    constructor(
        descriptionFile: string = config.reactionDataFile,
        pathwayLinkFile: string = config.reactionPathwayLinkFile,
        moduleLinkFile: string  = config.reactionModuleLinkFile,
        ecLinkFile: string      = config.ecReactionLinkFile
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

            this.set(reactionId, { 
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

            const reaction = this.get(reactionId);
            if (!reaction) {
                console.log(`Reaction id ${reactionId} not found (${path.basename(pathwayLinkFile)})`);
            } else if (!reaction.pathways.map(p => p.id).includes(pathwayId)) {
                const pathway = pathwayMap.get(pathwayId);
                reaction.pathways.push({ id: pathwayId, name: pathway?.name ?? '' });
            }
        });
    }

    private handleModuleLinkFile(moduleLinkFile: string) {
        this.readlines(moduleLinkFile, (line: string) => {
            const [ reactionId, moduleId ] = line.split('\t');

            const reaction = this.get(reactionId);
            if (!reaction) {
                console.log(`Reaction id ${reactionId} not found (${path.basename(moduleLinkFile)})`);
            } else if (!reaction.modules.map(m => m.id).includes(moduleId)) {
                const module = moduleMap.get(moduleId);
                reaction.modules.push({ id: moduleId, name: module?.name ?? '' });
            }
        });
    }

    private handleEcLinkFile(ecLinkFile: string) {
        this.readlines(ecLinkFile, (line: string) => {
            const [ ecNumber, reactionId ] = line.split('\t');

            const reaction = this.get(reactionId);
            if (!reaction) {
                console.log(`Reaction id ${reactionId} not found (${path.basename(ecLinkFile)})`);
            } else if (!reaction.ecNumbers.includes(ecNumber)) {
                reaction.ecNumbers.push(ecNumber);
            }
        });
    }
};

export default new ReactionMap();
