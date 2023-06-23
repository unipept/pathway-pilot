import { defaultProgressListener, ProgressListener } from "@/logic/ProgressListener";
import VerifierError from "../VerifierError";
import Verifier from "../Verifier";

export default class MetaProteomeAnalyzerVerifier implements Verifier {
    constructor(
        private readonly progressListener: ProgressListener = defaultProgressListener
    ) {}

    public verify(mpaResult: string[]) {
        const errors: VerifierError[] = [];

        for (const [ i, line ] of mpaResult.entries()) {
            const peptide = line.split('\t')[2].trim();
            if (!/^[ACDEFGHIKLMNPQRSTVWY]+$/.test(peptide)) {
                errors.push(new VerifierError(i, "Peptide contains invalid characters"));
            }

            this.progressListener.onProgressUpdate(i / mpaResult.length);
        }

        return errors;
    }
};
