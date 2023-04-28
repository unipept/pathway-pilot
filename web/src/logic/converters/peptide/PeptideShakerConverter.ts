import ProgressListener from "./ProgressListener";
import PeptideListConverter from "./PeptideListConverter";

export default class PeptideShakerConverter {
    constructor(
        private readonly progressListener: ProgressListener
    ) {}

    public async convert(peptideShakerResult: string[]) {
        const sequenceIndex = peptideShakerResult[0]
            .split('\t').map(s => s.trim()).indexOf('Sequence');
        const peptideList = peptideShakerResult.slice(1).map(s => 
            s.split('\t')[sequenceIndex].trim()
        )

        return await new PeptideListConverter(this.progressListener).convert(peptideList);
    }
}
