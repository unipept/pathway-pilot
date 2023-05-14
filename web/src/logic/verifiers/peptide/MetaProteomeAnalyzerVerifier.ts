import VerifierError from "../VerifierError";

export default class MetaProteomeAnalyzerVerifier {
    constructor() {}

    public verify(mpaResult: string[]) {
        const errors: VerifierError[] = [];

        for (const [ i, line ] of mpaResult.entries()) {
            const peptide = line.split('\t')[2].trim();
            if (!/^[ACDEFGHIKLMNPQRSTVWY]+$/.test(peptide)) {
                errors.push(new VerifierError(i, "Peptide contains invalid characters"));
            }
        }

        return errors;
    }
};
