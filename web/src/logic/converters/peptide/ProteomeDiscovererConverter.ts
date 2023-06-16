import ProgressListener from "../ProgressListener";
import PeptideListConverter from "./PeptideListConverter";

export default class ProteomeDiscovererConverter {
    constructor(
        private readonly progressListener: ProgressListener
    ) {}

    public async convert(proteomeDiscovererResult: string[]) {
        const sequenceIndex = proteomeDiscovererResult[0]
            .split('\t').map(s => s.trim()).indexOf('"Annotated Sequence"');
        const peptideList = proteomeDiscovererResult.slice(1).map(s => 
            s.split('\t')[sequenceIndex].split('.')[1].toUpperCase()
        );

        return await new PeptideListConverter(this.progressListener).convert(peptideList);
    }
}
