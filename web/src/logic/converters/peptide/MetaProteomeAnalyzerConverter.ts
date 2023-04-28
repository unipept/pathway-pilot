import ProgressListener from "./ProgressListener";
import PeptideListConverter from "./PeptideListConverter";

export default class MetaProteomeAnalyzerConverter {
    constructor(
        private readonly progressListener: ProgressListener
    ) {}

    public async convert(mpaResult: string[]) {
        const peptideList = mpaResult.map(s => s.split('\t')[2]);

        return await new PeptideListConverter(this.progressListener).convert(peptideList);
    }
}
