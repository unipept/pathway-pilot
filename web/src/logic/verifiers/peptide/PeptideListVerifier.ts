import VerifierError from "../VerifierError";

export default class PeptideListVerifier {
    constructor() {}

    public verify(peptideList: string[]) {
        const errors: VerifierError[] = [];

        for (const [ i, peptide ] of peptideList.entries()) {
            if (!/^[ACDEFGHIKLMNPQRSTVWY]+$/.test(peptide)) {
                errors.push(new VerifierError(i, "Peptide contains invalid characters"));
            }
        }

        return errors;
    }
};
