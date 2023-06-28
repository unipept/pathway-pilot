import { defaultProgressListener, ProgressListener } from "@/logic/ProgressListener";
import PeptideListConverter from "./PeptideListConverter";
import Converter from "../Converter";
import KeggCommunicator from "@/logic/communicators/KEGGCommunicator";
import UnipeptCommunicator from "@/logic/communicators/UnipeptCommunicator";

export default class MaxQuantConverter implements Converter {
    constructor(
        private readonly progressListener: ProgressListener = defaultProgressListener
    ) {}

    public isPeptide() {
        return true;
    }

    public async convert(maxQuantResult: string[]) {
        const sequenceIndex = maxQuantResult[0]
            .split('\t').map(s => s.trim()).indexOf('Sequence');
        const peptideList = maxQuantResult.slice(1).map(s => 
            s.split('\t')[sequenceIndex].trim()
        );

        return await new PeptideListConverter(this.progressListener).convert(peptideList);
    }
}
