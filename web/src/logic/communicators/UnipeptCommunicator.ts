export default class UnipeptCommunicator {
    constructor(
        private readonly baseUrl: string = "http://api.unipept.ugent.be/api/v2"
    ) {}

    public async fetchPeptideInfo(peptideList: string[], chunksize=100) {
        const result: any[] = [];

        for (let i = 0; i < peptideList.length; i += chunksize) {
            const chunk = peptideList.slice(i, i + chunksize);

            const url = `${this.baseUrl}/peptinfo.json?input[]=${chunk.join("&input[]=")}`;
            await fetch(url, { method: 'POST', headers: { "content-type": "application/json" } })
                .then(response => response.json())
                .then(data => result.push(...data));
        }

        return result;
    }
};
