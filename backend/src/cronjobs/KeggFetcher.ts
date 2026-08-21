import fs from 'fs';
import path from 'path';
import axios from "axios"
import config from '../config/config';

export default class KeggFetcher {
    constructor() {}

    /**
     * Refresh every KEGG data and link file.
     *
     * Runs the fetches one at a time rather than all 19 at once: KEGG is a
     * shared public service and this is a background job, so there is nothing
     * to gain from hammering it. Rejects on the first failure, leaving the
     * files that had already been written in place.
     */
    public async fetchFiles(): Promise<void> {
        const steps: [string, () => Promise<void>][] = [
            ['ec',                () => this.fetchEcDataFile()],
            ['ko',                () => this.fetchKoDataFile()],
            ['reaction',          () => this.fetchReactionDataFile()],
            ['compound',          () => this.fetchCompoundDataFile()],
            ['pathway',           () => this.fetchPathwayDataFile()],
            ['module',            () => this.fetchModuleDataFile()],
            ['ec2ko',             () => this.fetchEcKoLinkFile()],
            ['ec2reaction',       () => this.fetchEcReactionLinkFile()],
            ['ec2compound',       () => this.fetchEcCompoundLinkFile()],
            ['ec2pathway',        () => this.fetchEcPathwayLinkFile()],
            ['ec2module',         () => this.fetchEcModuleLinkFile()],
            ['ko2reaction',       () => this.fetchKoReactionLinkFile()],
            ['ko2pathway',        () => this.fetchKoPathwayLinkFile()],
            ['ko2module',         () => this.fetchKoModuleLinkFile()],
            ['reaction2compound', () => this.fetchReactionCompoundLinkFile()],
            ['reaction2pathway',  () => this.fetchReactionPathwayLinkFile()],
            ['reaction2module',   () => this.fetchReactionModuleLinkFile()],
            ['compound2pathway',  () => this.fetchCompoundPathwayLinkFile()],
            ['compound2module',   () => this.fetchCompoundModuleLinkFile()],
        ];

        for (const [n, [name, run]] of steps.entries()) {
            console.log(`[kegg-refresh] ${n + 1}/${steps.length} ${name}`);
            await run();
        }
    }

    private async fetchEcDataFile() {
        const trimmedData = await this.fetchDataFile("https://rest.kegg.jp/list/ec", this.stripEc);
        await this.writeFile(config.ecDataFile, trimmedData);
    }

    private async fetchKoDataFile() {
        const trimmedData = await this.fetchDataFile("https://rest.kegg.jp/list/ko", this.stripKo);
        await this.writeFile(config.koDataFile, trimmedData);
    }

    private async fetchReactionDataFile() {
        const trimmedData = await this.fetchDataFile("https://rest.kegg.jp/list/rn", this.stripReaction);
        await this.writeFile(config.reactionDataFile, trimmedData);
    }

    private async fetchCompoundDataFile() {
        const trimmedData = await this.fetchDataFile("https://rest.kegg.jp/list/cpd", this.stripCompound);
        await this.writeFile(config.compoundDataFile, trimmedData);
    }

    private async fetchPathwayDataFile() {
        const trimmedData = await this.fetchDataFile("https://rest.kegg.jp/list/pathway", this.stripPathway);
        await this.writeFile(config.pathwayDataFile, trimmedData);
    }

    private async fetchModuleDataFile() {
        const trimmedData = await this.fetchDataFile("https://rest.kegg.jp/list/module", this.stripModule);
        await this.writeFile(config.moduleDataFile, trimmedData);
    }

    private async fetchEcKoLinkFile() {
        const trimmedData = await this.fetchLinkFile("https://rest.kegg.jp/link/ko/ec", this.stripEc, this.stripKo);
        await this.writeFile(config.ecKoLinkFile, trimmedData);
    }

    private async fetchEcReactionLinkFile() {
        const trimmedData = await this.fetchLinkFile("https://rest.kegg.jp/link/rn/ec", this.stripEc, this.stripReaction);
        await this.writeFile(config.ecReactionLinkFile, trimmedData);
    }

    private async fetchEcCompoundLinkFile() {
        const trimmedData = await this.fetchLinkFile("https://rest.kegg.jp/link/cpd/ec", this.stripEc, this.stripCompound);
        await this.writeFile(config.ecCompoundLinkFile, trimmedData);
    }

    private async fetchEcPathwayLinkFile() {
        const trimmedData = await this.fetchLinkFile("https://rest.kegg.jp/link/pathway/ec", this.stripEc, this.stripPathway, this.filterEcPath);
        await this.writeFile(config.ecPathwayLinkFile, trimmedData);
    }

    private async fetchEcModuleLinkFile() {
        const trimmedData = await this.fetchLinkFile("https://rest.kegg.jp/link/module/ec", this.stripEc, this.stripModule);
        await this.writeFile(config.ecModuleLinkFile, trimmedData);
    }

    private async fetchKoReactionLinkFile() {
        // KEGG returns 400 for the `rn` abbreviation with `ko` as the source;
        // `reaction` is accepted and returns the identical `ko:K…\trn:R…` format.
        const trimmedData = await this.fetchLinkFile("https://rest.kegg.jp/link/reaction/ko", this.stripKo, this.stripReaction);
        await this.writeFile(config.koReactionLinkFile, trimmedData);
    }

    // private async fetchKoCompoundLinkFile() {
    //     const trimmedData = await this.fetchLinkFile("https://rest.kegg.jp/link/cpd/ko", this.stripKo, this.stripCompound);
    //     this.writeFile("../../data/link/ko2compound", trimmedData);
    // }

    private async fetchKoPathwayLinkFile() {
        const trimmedData = await this.fetchLinkFile("https://rest.kegg.jp/link/pathway/ko", this.stripKo, this.stripPathway, this.filterKoPath);
        await this.writeFile(config.koPathwayLinkFile, trimmedData);
    }

    private async fetchKoModuleLinkFile() {
        const trimmedData = await this.fetchLinkFile("https://rest.kegg.jp/link/module/ko", this.stripKo, this.stripModule);
        await this.writeFile(config.koModuleLinkFile, trimmedData);
    }

    private async fetchReactionCompoundLinkFile() {
        const trimmedData = await this.fetchLinkFile("https://rest.kegg.jp/link/cpd/rn", this.stripReaction, this.stripCompound);
        await this.writeFile(config.reactionCompoundLinkFile, trimmedData);
    }

    private async fetchReactionPathwayLinkFile() {
        const trimmedData = await this.fetchLinkFile("https://rest.kegg.jp/link/pathway/rn", this.stripReaction, this.stripPathway, this.filterReactionPath)
        await this.writeFile(config.reactionPathwayLinkFile, trimmedData);
    }

    private async fetchReactionModuleLinkFile() {
        const trimmedData = await this.fetchLinkFile("https://rest.kegg.jp/link/module/rn", this.stripReaction, this.stripModule);
        await this.writeFile(config.reactionModuleLinkFile, trimmedData);
    }

    private async fetchCompoundPathwayLinkFile() {
        const trimmedData = await this.fetchLinkFile("https://rest.kegg.jp/link/pathway/cpd", this.stripCompound, this.stripPathway);
        await this.writeFile(config.compoundPathwayLinkFile, trimmedData);
    }

    private async fetchCompoundModuleLinkFile() {
        const trimmedData = await this.fetchLinkFile("https://rest.kegg.jp/link/module/cpd", this.stripCompound, this.stripModule);
        await this.writeFile(config.compoundModuleLinkFile, trimmedData);
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


    /**
     * Write atomically: a full write to a temporary file followed by a rename,
     * so a crash or a failed fetch can never leave a half-written data file
     * behind for the API to read on its next start.
     *
     * Creates the target directory if it is missing, which is what makes the
     * first run on a fresh checkout able to seed an empty data directory.
     */
    private async writeFile(file: string, data: string) {
        await fs.promises.mkdir(path.dirname(file), { recursive: true });

        const tmp = `${file}.tmp`;
        await fs.promises.writeFile(tmp, data);
        await fs.promises.rename(tmp, file);
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
