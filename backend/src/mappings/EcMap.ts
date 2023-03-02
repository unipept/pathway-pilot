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

export type EcKey = string;

export type EcValue = {
    names: string[];
    pathways: KeggMap[];
    modules: KeggModule[];
    koNumbers: string[];
    reactionIds: string[];
};

class EcMap extends ReaderMap<EcKey, EcValue> {
    constructor(
        descriptionFile: string  = config.ecDataFile,
        pathwayLinkFile: string  = config.ecPathwayLinkFile,
        moduleLinkFile: string   = config.ecModuleLinkFile,
        koLinkFile: string       = config.ecKoLinkFile,
        reactionLinkFile: string = config.ecReactionLinkFile
    ) {
        super();

        this.handleDescriptionFile(descriptionFile);
        this.handlePathwayLinkFile(pathwayLinkFile);
        this.handleModuleLinkFile(moduleLinkFile);
        this.handleKoLinkFile(koLinkFile);
        this.handleReactionLinkFile(reactionLinkFile);
    }

    private handleDescriptionFile(descriptionFile: string) {
        this.readlines(descriptionFile, (line: string) => {
            const [ ecNumber, description ] = line.split('\t');

            this.set(ecNumber, { 
                names: description
                    .trim()
                    .split(';')
                    .map((n: string) => n.trim())
                    .filter((n: string) => n.length),
                pathways: [], 
                modules: [],
                koNumbers: [],
                reactionIds: []
            });
        });
    }

    private handlePathwayLinkFile(pathwayLinkFile: string) {
        this.readlines(pathwayLinkFile, (line: string) => {
            const [ ecNumber, pathwayId ] = line.split('\t');

            const ec = this.get(ecNumber);
            if (ec && !ec.pathways.map(p => p.id).includes(pathwayId)) {
                const pathway = pathwayMap.get(pathwayId);
                ec.pathways.push({ id: pathwayId, name: pathway?.name ?? '' });
            } else {
                // TODO: add logging or error handling or add without description
                console.log(`EC number ${ecNumber} not found`);
            }
        });
    }

    private handleModuleLinkFile(moduleLinkFile: string) {
        this.readlines(moduleLinkFile, (line: string) => {
            const [ ecNumber, moduleId ] = line.split('\t');

            const ec = this.get(ecNumber);
            if (ec && !ec.modules.map(m => m.id).includes(moduleId)) {
                const module = moduleMap.get(moduleId);
                ec.modules.push({ id: moduleId, name: module?.name ?? '' });
            } else {
                // TODO: add logging or error handling or add without description
                console.log(`EC number ${ecNumber} not found`);
            }
        });
    }

    private handleKoLinkFile(koLinkFile: string) {
        this.readlines(koLinkFile, (line: string) => {
            const [ ecNumber, koNumber ] = line.split('\t');

            const ec = this.get(ecNumber);
            if (ec && !ec.koNumbers.includes(koNumber)) {
                ec.koNumbers.push(koNumber);
            } else {
                // TODO: add logging or error handling or add without description
                console.log(`EC number ${ecNumber} not found`);
            }
        });
    }

    private handleReactionLinkFile(reactionLinkFile: string) {
        this.readlines(reactionLinkFile, (line: string) => {
            const [ ecNumber, reactionId ] = line.split('\t');

            const ec = this.get(ecNumber);
            if (ec && !ec.reactionIds.includes(reactionId)) {
                ec.reactionIds.push(reactionId);
            } else {
                // TODO: add logging or error handling or add without description
                console.log(`EC number ${ecNumber} not found`);
            }
        });
    }
};

export default new EcMap();
