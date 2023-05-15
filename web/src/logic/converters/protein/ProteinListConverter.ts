import KeggCommunicator from "../../communicators/KEGGCommunicator";
import UnipeptCommunicator from "../../communicators/UnipeptCommunicator";
import ProgressListener from "../ProgressListener";

export default class ProteinListConverter {
    private unipeptCommunicator: UnipeptCommunicator;
    private keggCommunicator: KeggCommunicator;

    constructor(
        private readonly progressListener: ProgressListener
    ) {
        this.unipeptCommunicator = new UnipeptCommunicator();
        this.keggCommunicator = new KeggCommunicator();
    }

    public async convert(proteinList: string[]) {
        const proteinInfo = await this.unipeptCommunicator.fetchProteinInfo(proteinList);

        const ecMapping = await this.keggCommunicator.fetchEcMapping();

        const proteinInfoLength = proteinInfo.length;

        const resultMapping = new Map<string, any>();
        for (const [ i, info ] of proteinInfo.entries()) {
            for (const ec of info.ec) {
                const mapping: any = ecMapping.get(ec.ec_number);

                if (!mapping) {
                    continue;
                }

                for (const pathway of mapping.pathways) {
                    const key = `${info.taxon_id}---${ec.ec_number}---${pathway.id}`;

                    let entry = resultMapping.get(key);

                    if (!entry) {
                        entry = {
                            taxon_id: info.taxon_id,
                            taxon_name: info.taxon_name,
                            taxon_rank: info.taxon_rank,
                            ec: ec.ec_number,
                            pathway: pathway.id,
                            pathwayName: pathway.name,
                            count: 0
                        };
                    }

                    entry.count += 1;

                    resultMapping.set(key, entry);
                }
            }

            this.progressListener.onProgressUpdate((i + 1) / proteinInfoLength);
        }

        return Array.from(resultMapping.values());
    }
}
