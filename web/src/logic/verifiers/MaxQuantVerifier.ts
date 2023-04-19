import VerifierError from "./VerifierError";

export default class MaxQuantVerifier {
    constructor() {}

    public verify(maxQuantResult: string[]) {
        const headerItems = maxQuantResult[0].split('\t').map(s => s.trim());
        if (!headerItems.includes('Sequence')) {
            return [ new VerifierError(0, "Your input is either missing its header or a 'Sequence' column") ];
        }

        const errors: VerifierError[] = [];

        const sequenceIndex = headerItems.indexOf('Sequence');
        for (const [ i, line ] of maxQuantResult.slice(1).entries()) {
            const peptide = line.split('\t')[sequenceIndex].trim();
            if (!/^[ACDEFGHIKLMNPQRSTVWY]+$/.test(peptide)) {
                errors.push(new VerifierError(i + 1, "Peptide contains invalid characters"));
            }
        }

        return errors;
    }
};
