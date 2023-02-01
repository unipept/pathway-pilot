import fs from 'fs';
import path from 'path';
import readline from 'readline';

// TODO: Replaces could be done on fetch once a day
// TODO: Then also throw out path:ko or path:ec from the file
// TODO: So much duplicate code, refactor

export type EcKey = string;

export type EcValue = {
    name: string;
    pathways: string[];
    koNumbers: string[];
};

export const buildEcMap = async () => {
    const map: Map<EcKey, EcValue> = new Map();

    const ec_fs = fs.createReadStream(path.join(__dirname, '../../../data/ec'));

    const ec_lines = readline.createInterface({ input: ec_fs, crlfDelay: Infinity });

    for await (const line of ec_lines) {
        const [ ecNumber, name ] = line.split('\t');

        map.set(ecNumber.replace('ec:', ''), { 
            name: name.trim(),
            pathways: [], 
            koNumbers: [] 
        });
    }

    const pathway_fs = fs.createReadStream(path.join(__dirname, '../../../data/link/ec2pathway'));

    const pathway_lines = readline.createInterface({ input: pathway_fs, crlfDelay: Infinity });

    for await (const line of pathway_lines) {
        const [ ecNumber, pathwayId ] = line.split('\t');

        if (pathwayId.startsWith('path:ec')) {
            continue;
        }

        const ec = map.get(ecNumber.replace('ec:', ''));

        if (ec === undefined) {
            console.log(`EC number ${ecNumber} not found`);
        }

        if (ec && !ec.pathways.includes(pathwayId.replace('path:', ''))) {
            ec.pathways.push(pathwayId.replace('path:', ''));
        } else {
            // TODO: add logging or error handling
            console.log(`EC number ${ec} not found`);
        }
    }

    const ko_fs = fs.createReadStream(path.join(__dirname, '../../../data/link/ec2ko'));

    const ko_lines = readline.createInterface({ input: ko_fs, crlfDelay: Infinity });

    for await (const line of ko_lines) {
        const [ ecNumber, koNumber ] = line.split('\t');

        const ec = map.get(ecNumber.replace('ec:', ''));
        if (ec && !ec.koNumbers.includes(koNumber.replace('ko:', ''))) {
            ec.koNumbers.push(koNumber.replace('ko:', ''));
        } else {
            // TODO: add logging or error handling
            console.log(`EC number ${ec} not found`);
        }
    }

    return map;
};
