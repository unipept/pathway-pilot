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

const descriptionEcRegex: RegExp = /\[EC:([^\]]+)\]$/;

export type KoKey = string;

export type KoValue = {
    names: string[];
    pathways: KeggMap[];
    modules: KeggModule[];
    ecNumbers: string[];
    reactionIds: string[];
};

export class KoMap extends ReaderMap<KoKey, KoValue> {
    constructor(
        descriptionFile: string  = config.koDataFile,
        pathwayLinkFile: string  = config.koPathwayLinkFile,
        moduleLinkFile: string   = config.koModuleLinkFile,
        ecLinkFile: string       = config.ecKoLinkFile,
        reactionLinkFile: string = config.koReactionLinkFile
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
            const [ koNumber, description ] = line.split('\t');

            const ecNumbers = description.match(descriptionEcRegex)?.[1]?.split(' ');

            this.set(koNumber, { 
                names: description
                    .trim()
                    .split(';')
                    .slice(1)
                    .map((n: string) => n.trim())
                    .filter((n: string) => n.length),
                pathways: [],
                modules: [],
                ecNumbers: ecNumbers ?? [],
                reactionIds: []
            });
        });
    }

    private handlePathwayLinkFile(pathwayLinkFile: string) {
        this.readlines(pathwayLinkFile, (line: string) => {
            const [ koNumber, pathwayId ] = line.split('\t');

            const ko = this.get(koNumber);
            if (ko && !ko.pathways.map(p => p.id).includes(pathwayId)) {
                const pathway = pathwayMap.get(pathwayId);
                ko.pathways.push({ id: pathwayId, name: pathway?.name ?? '' });
            } else {
                // TODO: add logging or error handling or add without description
                console.log(`KO number ${koNumber} not found`);
            }
        });
    }

    private handleModuleLinkFile(moduleLinkFile: string) {
        this.readlines(moduleLinkFile, (line: string) => {
            const [ koNumber, moduleId ] = line.split('\t');

            const ko = this.get(koNumber);
            if (ko && !ko.modules.map(m => m.id).includes(moduleId)) {
                const module = moduleMap.get(moduleId);
                ko.modules.push({ id: moduleId, name: module?.name ?? '' });
            } else {
                // TODO: add logging or error handling or add without description
                console.log(`KO number ${koNumber} not found`);
            }
        });
    }

    private handleEcLinkFile(ecLinkFile: string) {
        this.readlines(ecLinkFile, (line: string) => {
            const [ ecNumber, koNumber ] = line.split('\t');

            const ko = this.get(koNumber);
            if (ko && !ko.ecNumbers.includes(ecNumber)) {
                ko.ecNumbers.push(ecNumber);
            } else {
                // TODO: add logging or error handling or add without description
                console.log(`KO number ${koNumber} not found`);
            }
        });
    }

    private handleReactionLinkFile(reactionLinkFile: string) {
        this.readlines(reactionLinkFile, (line: string) => {
            const [ koNumber, reactionId ] = line.split('\t');

            const ko = this.get(koNumber);
            if (ko && !ko.reactionIds.includes(reactionId)) {
                ko.reactionIds.push(reactionId);
            } else {
                // TODO: add logging or error handling or add without description
                console.log(`KO number ${koNumber} not found`);
            }
        });
    }
};

export default new KoMap();
