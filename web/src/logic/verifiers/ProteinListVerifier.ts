import { defaultProgressListener, ProgressListener } from "@/logic/ProgressListener";
import Verifier from "./Verifier";

export default class ProteinListVerifier implements Verifier {
    constructor(
        private readonly progressListener: ProgressListener = defaultProgressListener
    ) {}

    public verify(proteinList: string[]) {
        this.progressListener.onProgressUpdate(1);

        return [];
    }
};
