import fs from 'fs';
import path from 'path';
import readline from 'readline';

// TODO: Replaces could be done on fetch once a day
// TODO: Then also throw out path:ko or path:ec from the file
// TODO: So much duplicate code, refactor

export type KoKey = string;

export type KoValue = {
    name: string;
    pathways: string[];
    ecNumbers: string[];
};

export const buildKoMap = async () => {
    const map: Map<KoKey, KoValue> = new Map();

    const ko_fs = fs.createReadStream(path.join(__dirname, '../../../data/ko'));

    const ko_lines = readline.createInterface({ input: ko_fs, crlfDelay: Infinity });

    for await (const line of ko_lines) {
        const [ koNumber, name ] = line.split('\t');

        map.set(koNumber.replace('ko:', ''), { 
            name: name.trim(),
            pathways: [], 
            ecNumbers: [] 
        });
    }

    const pathway_fs = fs.createReadStream(path.join(__dirname, '../../../data/link/ko2pathway'));

    const pathway_lines = readline.createInterface({ input: pathway_fs, crlfDelay: Infinity });

    for await (const line of pathway_lines) {
        const [ koNumber, pathwayId ] = line.split('\t');

        if (pathwayId.startsWith('path:ko')) {
            continue;
        }

        const ko = map.get(koNumber.replace('ko:', ''));
        if (ko && !ko.pathways.includes(pathwayId.replace('path:', ''))) {
            ko.pathways.push(pathwayId.replace('path:', ''));
        } else {
            // TODO: add logging or error handling
            console.log(`KO number ${ko} not found`);
        }
    }

    const ec_fs = fs.createReadStream(path.join(__dirname, '../../../data/link/ko2ec'));

    const ec_lines = readline.createInterface({ input: ec_fs, crlfDelay: Infinity });

    for await (const line of ec_lines) {
        const [ koNumber, ecNumber ] = line.split('\t');

        const ko = map.get(koNumber.replace('ko:', ''));
        if (ko && !ko.ecNumbers.includes(ecNumber.replace('ec:', ''))) {
            ko.ecNumbers.push(ecNumber.replace('ec:', ''));
        } else {
            // TODO: add logging or error handling
            console.log(`KO number ${ko} not found`);
        }
    }

    return map;
};
