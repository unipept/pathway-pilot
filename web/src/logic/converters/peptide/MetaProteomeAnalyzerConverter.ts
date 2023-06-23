import { defaultProgressListener, ProgressListener } from "@/logic/ProgressListener";
import PeptideListConverter from "./PeptideListConverter";
import Converter from "../Converter";
import KeggCommunicator from "@/logic/communicators/KEGGCommunicator";
import UnipeptCommunicator from "@/logic/communicators/UnipeptCommunicator";

export default class MetaProteomeAnalyzerConverter implements Converter {
    constructor(
        private readonly unipeptCommunicator: UnipeptCommunicator,
        private readonly keggCommunicator: KeggCommunicator = new KeggCommunicator(),
        private readonly progressListener: ProgressListener = defaultProgressListener
    ) {}

    public isPeptide() {
        return true;
    }

    public async convert(mpaResult: string[]) {
        const peptideList = mpaResult.map(s => s.split('\t')[2]);

        return await new PeptideListConverter(
            this.unipeptCommunicator, this.keggCommunicator, this.progressListener
        ).convert(peptideList);
    }
}
