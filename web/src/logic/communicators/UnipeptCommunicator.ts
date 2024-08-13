import { ProgressListener, defaultProgressListener } from "../ProgressListener";


export default class UnipeptCommunicator {
    constructor(
        private readonly progressListener: ProgressListener = defaultProgressListener,
        private readonly baseUrl: string = "https://api.unipept.ugent.be/api/v2"
    ) {}

    public async fetchPeptideInfo(peptideList: string[], chunksize=100) {
        return this.batchedFetch(`${this.baseUrl}/peptinfo`, peptideList, chunksize);
    }

    public async fetchProteinInfo(proteinList: string[], chunksize=100) {
        return this.batchedFetch(`${this.baseUrl}/protinfo`, proteinList, chunksize);
    }

    // TODO: what in case of more than 1000 ids?
    // Fetch id=1 and 99 other ids, then combine trees.
    // Start at the root for both trees, as soon as the trees diverge, add the other tree as a child.
    public async fetchTaxonomy(ids: number[]) {
        const url = `${this.baseUrl}/taxa2tree?input[]=${ids.join("&input[]=")}`;
        return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' } })
            .then(response => response.json());
    }

    private async batchedFetch(url: string, items: string[], chunksize=100) {
        const result: any[] = [];

        for (let i = 0; i < items.length; i += chunksize) {
            const chunk = items.slice(i, i + chunksize);

            const fetchUrl = `${url}?input[]=${chunk.join("&input[]=")}`;
            await fetch(fetchUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' } })
                .then(response => response.json())
                .then(data => result.push(...data))
                .then(() => this.progressListener.onProgressUpdate(i / items.length));
        }

        this.progressListener.onProgressUpdate(1);

        return result;
    }
};
