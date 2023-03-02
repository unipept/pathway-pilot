export default class VerifierError {
    constructor(
        public readonly line: number,
        public readonly message: string
    ) {}
};
