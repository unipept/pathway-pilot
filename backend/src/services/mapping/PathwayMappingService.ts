import fs from 'fs';
import path from 'path';
import readline from 'readline';

// TODO: Replaces could be done on fetch once a day
// TODO: Then also throw out path:ko or path:ec from the file
// TODO: So much duplicate code, refactor

export type PathwayKey = string;

export type PathwayValue = {
    name: string;
    ecNumbers: string[];
    koNumbers: string[];
};

export const buildPathwayMap = async () => {
    const map: Map<PathwayKey, PathwayValue> = new Map();

    const pathway_fs = fs.createReadStream(path.join(__dirname, '../../../data/pathway'));

    const pathway_lines = readline.createInterface({ input: pathway_fs, crlfDelay: Infinity });

    for await (const line of pathway_lines) {
        const [ pathwayId, name ] = line.split('\t');

        map.set(pathwayId.replace('path:', ''), { 
            name: name.trim(), 
            ecNumbers: [], 
            koNumbers: [] 
        });
    }

    const ec_fs = fs.createReadStream(path.join(__dirname, '../../../data/link/pathway2ec'));

    const ec_lines = readline.createInterface({ input: ec_fs, crlfDelay: Infinity });

    for await (const line of ec_lines) {
        const [ pathwayId, ecNumber ] = line.split('\t');

        if (pathwayId.startsWith('path:ec')) {
            continue;
        }

        const pathway = map.get(pathwayId.replace('path:', ''));
        if (pathway && !pathway.ecNumbers.includes(ecNumber.replace('ec:', ''))) {
            pathway.ecNumbers.push(ecNumber.replace('ec:', ''));
        } else {
            // TODO: add logging or error handling
            console.log(`Pathway ${pathwayId} not found`);
        }
    }

    const ko_fs = fs.createReadStream(path.join(__dirname, '../../../data/link/pathway2ko'));

    const ko_lines = readline.createInterface({ input: ko_fs, crlfDelay: Infinity });

    for await (const line of ko_lines) {
        const [ pathwayId, koNumber ] = line.split('\t');

        if (pathwayId.startsWith('path:ko')) {
            continue;
        }

        const pathway = map.get(pathwayId.replace('path:', ''));
        if (pathway && !pathway.koNumbers.includes(koNumber.replace('ko:', ''))) {
            pathway.koNumbers.push(koNumber.replace('ko:', ''));
        } else {
            // TODO: add logging or error handling
            console.log(`Pathway ${pathwayId} not found`);
        }
    }

    return map;
};
