import KeggCommunicator from "../communicators/KeggCommunicator";
import UnipeptCommunicator from "../communicators/UnipeptCommunicator";
import ProgressListener from "./ProgressListener";

export default class PeptideListConverter {
    private unipeptCommunicator: UnipeptCommunicator;
    private keggCommunicator: KeggCommunicator;

    constructor(
        private readonly progressListener: ProgressListener
    ) {
        this.unipeptCommunicator = new UnipeptCommunicator();
        this.keggCommunicator = new KeggCommunicator();
    }

    public async convert(peptideList: string[]) {
        const peptideInfo = await this.unipeptCommunicator.fetchPeptideInfo(peptideList);

        const ecMapping = await this.keggCommunicator.fetchEcMapping();

        const peptideInfoLength = peptideInfo.length;

        const resultMapping = new Map<string, any>();
        for (const [ i, info ] of peptideInfo.entries()) {
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

            this.progressListener.onProgressUpdate((i + 1) / peptideInfoLength);
        }

        return Array.from(resultMapping.values());
    }
}
