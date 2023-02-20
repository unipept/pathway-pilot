export default class KeggCommunicator {
    constructor(
        private readonly baseUrl: string = "http://localhost:4000"
    ) {}

    public async fetchEcMapping() {
        return await this.fetchMapping(`${this.baseUrl}/mapping/ec`);
    }

    public async fetchKoMapping() {
        return await this.fetchMapping(`${this.baseUrl}/mapping/ko`);
    }

    public async fetchReactionMapping() {
        return await this.fetchMapping(`${this.baseUrl}/mapping/reaction`);
    }

    public async fetchCompoundMapping() {
        return await this.fetchMapping(`${this.baseUrl}/mapping/compound`);
    }

    private async fetchMapping(url: string) {
        return await fetch(url, { headers: { "content-type": "application/json" } })
            .then(response => response.json())
            .then(data => new Map(Object.entries(data)));
    }
};
