import VerifierError from './VerifierError';

export default interface Verifier {
    verify(input: string[]): VerifierError[];
};
