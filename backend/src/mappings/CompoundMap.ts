import ReaderMap from './ReaderMap';
import pathwayMap from './PathwayMap';
import moduleMap from './ModuleMap';
import { KeggMap } from '../models/annotations/KeggMap';
import { KeggModule } from '../models/annotations/KeggModule';

// TODO: Replaces could be done on fetch once a day
// TODO: Then also throw out path:ko or path:ec from the file
// TODO: So much duplicate code, refactor
// TODO: Put file locations in config file

export type CompoundKey = string;

export type CompoundValue = {
    names: string[];
    pathways: KeggMap[];
    modules: KeggModule[];
    ecNumbers: string[];
    reactionIds: string[];
};

class CompoundMap extends ReaderMap<CompoundKey, CompoundValue> {
    constructor(
        descriptionFile: string = '../../data/compound',
        pathwayLinkFile: string = '../../data/link/compound2pathway',
        moduleLinkFile: string = '../../data/link/compound2module',
        ecLinkFile: string = '../../data/link/ec2compound',
        reactionLinkFile: string = '../../data/link/reaction2compound'
    ) {
        super();

        this.handleDescriptionFile(descriptionFile);
        this.handlePathwayLinkFile(pathwayLinkFile);
        this.handleModuleLinkFile(moduleLinkFile);
        this.handleEcLinkFile(ecLinkFile);
        this.handleReactionLinkFile(reactionLinkFile);
    }

    private handleDescriptionFile(descriptionFile: string) {
        this.readlines(descriptionFile, (line: string) => {
            const [ compoundId, description ] = line.split('\t');

            this.set(compoundId, { 
                names: description
                    .trim()
                    .split(';')
                    .map((n: string) => n.trim())
                    .filter((n: string) => n.length),
                pathways: [], 
                modules: [],
                ecNumbers: [],
                reactionIds: []
            });
        });
    }

    private handlePathwayLinkFile(pathwayLinkFile: string) {
        this.readlines(pathwayLinkFile, (line: string) => {
            const [ compoundId, pathwayId ] = line.split('\t');

            const compound = this.get(compoundId);
            if (compound && !compound.pathways.map(p => p.id).includes(pathwayId)) {
                const pathway = pathwayMap.get(pathwayId);
                compound.pathways.push({ id: pathwayId, name: pathway?.name ?? '' });
            } else {
                // TODO: add logging or error handling or add without description
                console.log(`Compound id ${compoundId} not found`);
            }
        });
    }

    private handleModuleLinkFile(moduleLinkFile: string) {
        this.readlines(moduleLinkFile, (line: string) => {
            const [ compoundId, moduleId ] = line.split('\t');

            const compound = this.get(compoundId);
            if (compound && !compound.modules.map(m => m.id).includes(moduleId)) {
                const module = moduleMap.get(moduleId);
                compound.modules.push({ id: moduleId, name: module?.name ?? '' });
            } else {
                // TODO: add logging or error handling or add without description
                console.log(`Compound id ${compoundId} not found`);
            }
        });
    }

    private handleEcLinkFile(ecLinkFile: string) {
        this.readlines(ecLinkFile, (line: string) => {
            const [ ecNumber, compoundId ] = line.split('\t');

            const compound = this.get(compoundId);
            if (compound && !compound.ecNumbers.includes(ecNumber)) {
                compound.ecNumbers.push(ecNumber);
            } else {
                // TODO: add logging or error handling or add without description
                console.log(`Compound id ${compoundId} not found`);
            }
        });
    }

    private handleReactionLinkFile(reactionLinkFile: string) {
        this.readlines(reactionLinkFile, (line: string) => {
            const [ reactionId, compoundId ] = line.split('\t');

            const compound = this.get(compoundId);
            if (compound && !compound.reactionIds.includes(reactionId)) {
                compound.reactionIds.push(reactionId);
            } else {
                // TODO: add logging or error handling or add without description
                console.log(`Compound id ${compoundId} not found`);
            }
        });
    }
};

export default new CompoundMap();
