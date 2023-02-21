// TODO: use .env file to store the endpoints
// TODO: set cron job to run every day

import fs from 'fs';
import axios from "axios"
import path from 'path';

export default class KeggFetcher {
    constructor() {}

    public fetchFiles() {
        this.fetchDataFiles();
        this.fetchLinkFiles();
    }

    private fetchDataFiles() {
        this.fetchEcDataFile();
        this.fetchKoDataFile();
        this.fetchReactionDataFile();
        this.fetchCompoundDataFile();
        this.fetchPathwayDataFile();
        this.fetchModuleDataFile();
    }

    private fetchLinkFiles() {
        this.fetchEcKoLinkFile();
        this.fetchEcReactionLinkFile();
        this.fetchEcCompoundLinkFile();
        this.fetchEcPathwayLinkFile();
        this.fetchEcModuleLinkFile();

        this.fetchKoReactionLinkFile();
        this.fetchKoPathwayLinkFile();
        this.fetchKoModuleLinkFile();

        this.fetchReactionCompoundLinkFile();
        this.fetchReactionPathwayLinkFile();
        this.fetchReactionModuleLinkFile();

        this.fetchCompoundPathwayLinkFile();
        this.fetchCompoundModuleLinkFile();
    }

    private async fetchEcDataFile() {
        const trimmedData = await this.fetchDataFile("https://rest.kegg.jp/list/ec", this.stripEc);
        this.writeFile("../../data/ec", trimmedData);
    }

    private async fetchKoDataFile() {
        const trimmedData = await this.fetchDataFile("https://rest.kegg.jp/list/ko", this.stripKo);
        this.writeFile("../../data/ko", trimmedData);
    }

    private async fetchReactionDataFile() {
        const trimmedData = await this.fetchDataFile("https://rest.kegg.jp/list/rn", this.stripReaction);
        this.writeFile("../../data/reaction", trimmedData);
    }

    private async fetchCompoundDataFile() {
        const trimmedData = await this.fetchDataFile("https://rest.kegg.jp/list/cpd", this.stripCompound);
        this.writeFile("../../data/compound", trimmedData);
    }

    private async fetchPathwayDataFile() {
        const trimmedData = await this.fetchDataFile("https://rest.kegg.jp/list/pathway", this.stripPathway);
        this.writeFile("../../data/pathway", trimmedData);
    }

    private async fetchModuleDataFile() {
        const trimmedData = await this.fetchDataFile("https://rest.kegg.jp/list/module", this.stripModule);
        this.writeFile("../../data/module", trimmedData);
    }

    private async fetchEcKoLinkFile() {
        const trimmedData = await this.fetchLinkFile("https://rest.kegg.jp/link/ko/ec", this.stripEc, this.stripKo);
        this.writeFile("../../data/link/ec2ko", trimmedData);
    }

    private async fetchEcReactionLinkFile() {
        const trimmedData = await this.fetchLinkFile("https://rest.kegg.jp/link/rn/ec", this.stripEc, this.stripReaction);
        this.writeFile("../../data/link/ec2reaction", trimmedData);
    }

    private async fetchEcCompoundLinkFile() {
        const trimmedData = await this.fetchLinkFile("https://rest.kegg.jp/link/cpd/ec", this.stripEc, this.stripCompound);
        this.writeFile("../../data/link/ec2compound", trimmedData);
    }

    private async fetchEcPathwayLinkFile() {
        const trimmedData = await this.fetchLinkFile("https://rest.kegg.jp/link/pathway/ec", this.stripEc, this.stripPathway, this.filterEcPath);
        this.writeFile("../../data/link/ec2pathway", trimmedData);
    }

    private async fetchEcModuleLinkFile() {
        const trimmedData = await this.fetchLinkFile("https://rest.kegg.jp/link/module/ec", this.stripEc, this.stripModule);
        this.writeFile("../../data/link/ec2module", trimmedData);
    }

    private async fetchKoReactionLinkFile() {
        const trimmedData = await this.fetchLinkFile("https://rest.kegg.jp/link/rn/ko", this.stripKo, this.stripReaction);
        this.writeFile("../../data/link/ko2reaction", trimmedData);
    }

    // private async fetchKoCompoundLinkFile() {
    //     const trimmedData = await this.fetchLinkFile("https://rest.kegg.jp/link/cpd/ko", this.stripKo, this.stripCompound);
    //     this.writeFile("../../data/link/ko2compound", trimmedData);
    // }

    private async fetchKoPathwayLinkFile() {
        const trimmedData = await this.fetchLinkFile("https://rest.kegg.jp/link/pathway/ko", this.stripKo, this.stripPathway, this.filterKoPath);
        this.writeFile("../../data/link/ko2pathway", trimmedData);
    }

    private async fetchKoModuleLinkFile() {
        const trimmedData = await this.fetchLinkFile("https://rest.kegg.jp/link/module/ko", this.stripKo, this.stripModule);
        this.writeFile("../../data/link/ko2module", trimmedData);
    }

    private async fetchReactionCompoundLinkFile() {
        const trimmedData = await this.fetchLinkFile("https://rest.kegg.jp/link/cpd/rn", this.stripReaction, this.stripCompound);
        this.writeFile("../../data/link/reaction2compound", trimmedData);
    }

    private async fetchReactionPathwayLinkFile() {
        const trimmedData = await this.fetchLinkFile("https://rest.kegg.jp/link/pathway/rn", this.stripReaction, this.stripPathway, this.filterReactionPath)
        this.writeFile("../../data/link/reaction2pathway", trimmedData);
    }

    private async fetchReactionModuleLinkFile() {
        const trimmedData = await this.fetchLinkFile("https://rest.kegg.jp/link/module/rn", this.stripReaction, this.stripModule);
        this.writeFile("../../data/link/reaction2module", trimmedData);
    }

    private async fetchCompoundPathwayLinkFile() {
        const trimmedData = await this.fetchLinkFile("https://rest.kegg.jp/link/pathway/cpd", this.stripCompound, this.stripPathway);
        this.writeFile("../../data/link/compound2pathway", trimmedData);
    }

    private async fetchCompoundModuleLinkFile() {
        const trimmedData = await this.fetchLinkFile("https://rest.kegg.jp/link/module/cpd", this.stripCompound, this.stripModule);
        this.writeFile("../../data/link/compound2module", trimmedData);
    }

    private async fetchDataFile(url: string, strip: (s: string) => string) {
        return await this.fetchColumnFile(url, strip, s => s);
    }

    private async fetchLinkFile(
        url: string,
        lstrip: (s: string) => string,
        rstrip: (s: string) => string,
        filter: (s: string) => boolean = () => true
    ) {
        return await this.fetchColumnFile(url, lstrip, rstrip, filter);
    }

    private async fetchColumnFile(
        url: string, 
        ltrans: (s: any) => string, 
        rtrans: (s: any) => string,
        filter: (s: string) => boolean = () => true
    ) {
        return await axios
            .get(url)
            .then(res => res.data)
            .then((data: string) => data
                .trim()
                .split('\n')
                .filter(filter)
                .map((line: string) => {
                    const [ lEntry, rEntry ] = line.split('\t')
                    return `${ltrans(lEntry)}\t${rtrans(rEntry)}`;
                })
                .join('\n'));
    }


    private async writeFile(file: string, data: string) {
        fs.writeFile(path.join(__dirname, file), data, err => {
            if (err) {
                console.error(err)
            }
        })
    }

    private stripEc(ecNumber: string) {
        return ecNumber.replace('ec:', '');
    }

    private stripKo(koNumber: string) {
        return koNumber.replace('ko:', '');
    }

    private stripReaction(reactionId: string) {
        return reactionId.replace('rn:', '');
    }

    private stripCompound(compoundId: string) {
        return compoundId.replace('cpd:', '');
    }

    private stripPathway(pathwayId: string) {
        return pathwayId.replace('path:', '');
    }

    private stripModule(moduleId: string) {
        return moduleId.replace('md:', '');
    }

    private filterReactionPath(line: string) {
        return !line.includes('path:rn');
    }

    private filterEcPath(line: string) {
        return !line.includes('path:ec');
    }

    private filterKoPath(line: string) {
        return !line.includes('path:ko');
    }
}
