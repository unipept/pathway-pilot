import ProgressListener from "../ProgressListener";
import PeptideListConverter from "./PeptideListConverter";
import Converter from "../Converter";

export default class ProteomeDiscovererConverter implements Converter {
    constructor(
        private readonly progressListener: ProgressListener
    ) {}

    public isPeptide() {
        return true;
    }

    public async convert(proteomeDiscovererResult: string[]) {
        const sequenceIndex = proteomeDiscovererResult[0]
            .split('\t').map(s => s.trim()).indexOf('"Annotated Sequence"');
        const peptideList = proteomeDiscovererResult.slice(1).map(s => 
            s.split('\t')[sequenceIndex].split('.')[1].toUpperCase()
        );

        return await new PeptideListConverter(this.progressListener).convert(peptideList);
    }
}
