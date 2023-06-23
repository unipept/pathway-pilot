import { defaultProgressListener, ProgressListener } from "@/logic/ProgressListener";
import PeptideListConverter from "./PeptideListConverter";
import Converter from "../Converter";
import KeggCommunicator from "@/logic/communicators/KEGGCommunicator";
import UnipeptCommunicator from "@/logic/communicators/UnipeptCommunicator";

export default class ProteomeDiscovererConverter implements Converter {
    constructor(
        private readonly unipeptCommunicator: UnipeptCommunicator,
        private readonly keggCommunicator: KeggCommunicator = new KeggCommunicator(),
        private readonly progressListener: ProgressListener = defaultProgressListener
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

        return await new PeptideListConverter(
            this.unipeptCommunicator, this.keggCommunicator, this.progressListener
        ).convert(peptideList);
    }
}
