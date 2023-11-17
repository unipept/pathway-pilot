import { defaultProgressListener, ProgressListener } from "@/logic/ProgressListener";
import VerifierError from "./VerifierError";
import Verifier from "./Verifier";

export default class PeptideListVerifier implements Verifier {
    constructor(
        private readonly progressListener: ProgressListener = defaultProgressListener
    ) {}

    public verify(peptideList: string[]) {
        const errors: VerifierError[] = [];

        for (const [ i, peptide ] of peptideList.entries()) {
            if (!/^[ACDEFGHIKLMNPQRSTVWY]+$/.test(peptide)) {
                errors.push(new VerifierError(i, "Peptide contains invalid characters"));
            }

            this.progressListener.onProgressUpdate(i / peptideList.length);
        }

        return errors;
    }
};
