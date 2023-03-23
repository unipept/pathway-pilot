export default class UnipeptCommunicator {
    constructor(
        private readonly baseUrl: string = "https://api.unipept.ugent.be/api/v2"
    ) {}

    public async fetchPeptideInfo(peptideList: string[], chunksize=100) {
        const result: any[] = [];

        for (let i = 0; i < peptideList.length; i += chunksize) {
            const chunk = peptideList.slice(i, i + chunksize);

            const url = `${this.baseUrl}/peptinfo.json?input[]=${chunk.join("&input[]=")}`;
            await fetch(url, { method: 'POST' })
                .then(response => response.json())
                .then(data => result.push(...data));
        }

        return result;
    }

    // TODO: what in case of more than 1000 ids?
    // Fetch id=1 and 99 other ids, then combine trees.
    // Start at the root for both trees, as soon as the trees diverge, add the other tree as a child.
    public async fetchTaxonomy(ids: number[]) {
        const url = `${this.baseUrl}/taxa2tree.json?input[]=${ids.join("&input[]=")}`;
        return fetch(url, { method: 'POST' })
            .then(response => response.json());
    }
};
