export default class KeggCommunicator {
    constructor(
        private readonly baseUrl: string = "http://localhost:4000"
    ) {}

    public async fetchEcMapping() {
        const url = `${this.baseUrl}/mapping/ec`;

        return await fetch(url, { headers: { "content-type": "application/json" } })
            .then(response => response.json())
            .then(data => new Map(Object.entries(data)));
    }

    public async fetchKoMapping() {
        const url = `${this.baseUrl}/mapping/ko`;

        return await fetch(url, { headers: { "content-type": "application/json" } })
            .then(response => response.json())
            .then(data => new Map(Object.entries(data)));
    }

    public async fetchReactionMapping() {
        const url = `${this.baseUrl}/mapping/reaction`;

        return await fetch(url, { headers: { "content-type": "application/json" } })
            .then(response => response.json())
            .then(data => new Map(Object.entries(data)));
    }
};
