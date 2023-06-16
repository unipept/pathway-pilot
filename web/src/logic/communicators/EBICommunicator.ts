export default class EBICommunicator {
    constructor(
        private readonly baseUrl: string = "https://www.ebi.ac.uk/proteins/api/proteins"
    ) {}

    public async fetchProteinInfo(proteinList: string[], chunksize=100) {
        const result: any[] = [];

        for (const protein of proteinList) {
            const url = `${this.baseUrl}/${protein}`;
            await fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' } })
                .then(response => response.json())
                .then(data => result.push(data));
        }

        console.log(result);

        return result;
    }
};
