import ProgressListener from "../ProgressListener";
import PeptideListConverter from "./PeptideListConverter";
import Converter from "../Converter";

export default class MetaProteomeAnalyzerConverter implements Converter {
    constructor(
        private readonly progressListener: ProgressListener
    ) {}

    public isPeptide() {
        return true;
    }

    public async convert(mpaResult: string[]) {
        const peptideList = mpaResult.map(s => s.split('\t')[2]);

        return await new PeptideListConverter(this.progressListener).convert(peptideList);
    }
}
