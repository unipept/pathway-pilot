import ProgressListener from "./ProgressListener";

export default class PeptideListConverter {
    constructor(
        private readonly progressListener: ProgressListener
    ) {}

    public async convert(peptideList: string[]) {
        const peptideInfo = await this.fetchUnipeptInfo(peptideList);

        const ecMapping = await this.fetchKeggMapping();

        const peptideInfoLength = peptideInfo.length;

        const resultMapping = new Map<string, any>();
        for (const [ i, info ] of peptideInfo.entries()) {
            for (const ec of info.ec) {
                const mapping: any = ecMapping.get(ec.ec_number);

                if (!mapping) {
                    continue;
                }

                for (const pathway of mapping.pathways) {
                    const key = `${info.taxon_id}---${ec.ec_number}---${pathway}`;

                    let entry = resultMapping.get(key);

                    if (!entry) {
                        entry = {
                            taxon_id: info.taxon_id,
                            taxon_name: info.taxon_name,
                            taxon_rank: info.taxon_rank,
                            ec: ec.ec_number,
                            pathway: pathway,
                            count: 0
                        };
                    }

                    entry.count += 1;

                    resultMapping.set(key, entry);
                }

            }

            this.progressListener.onProgressUpdate((i + 1) / peptideInfoLength);
        }

        return Array.from(resultMapping.values());
    }

    private async fetchUnipeptInfo(peptideList: string[], chunksize=100) {
        const result: any[] = [];
        for (let i = 0; i < peptideList.length; i += chunksize) {
            const chunk = peptideList.slice(i, i + chunksize);
            const url = "http://api.unipept.ugent.be/api/v2/peptinfo.json?input[]=" + chunk.join("&input[]=");
            await fetch(url, { method: 'POST', headers: { "content-type": "application/json" } })
                .then(response => response.json())
                .then(data => result.push(...data));
        }

        return result;
    }

    private async fetchKeggMapping() {
        const url = "http://localhost:4000/mapping/ec";

        return await fetch(url, { headers: { "content-type": "application/json" } })
            .then(response => response.json())
            .then(data => new Map(Object.entries(data)));
    }
}
