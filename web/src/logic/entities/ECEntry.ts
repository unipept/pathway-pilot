export default class ECEntry {
    constructor(
        public readonly id: string,
        public readonly containedInPathways: string[]
    ) {}
}
