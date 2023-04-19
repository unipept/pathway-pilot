import VerifierError from "./VerifierError";

export default class ProteomeDiscovererVerifier {
    constructor() {}

    public verify(proteomeDiscovererResult: string[]) {
        const headerItems = proteomeDiscovererResult[0].split('\t').map(s => s.trim());
        if (!headerItems.includes('"Annotated Sequence"')) {
            return [ new VerifierError(0, "Your input is either missing its header or a 'Annotated Sequence' column") ];
        }

        const errors: VerifierError[] = [];

        const sequenceIndex = headerItems.indexOf('"Annotated Sequence"');
        for (const [ i, line ] of proteomeDiscovererResult.slice(1).entries()) {
            const peptide = line.split('\t')[sequenceIndex].split('.')[1].toUpperCase();
            if (!/^[ACDEFGHIKLMNPQRSTVWY]+$/.test(peptide)) {
                errors.push(new VerifierError(i + 1, "Peptide contains invalid characters"));
            }
        }

        return errors;
    }
};
