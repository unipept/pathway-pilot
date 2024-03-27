import KeggCommunicator from "../communicators/KEGGCommunicator";
import UnipeptCommunicator from "../communicators/UnipeptCommunicator";
import { defaultProgressListener, ProgressListener } from "@/logic/ProgressListener";
import Converter from "./Converter";

export default class ProteinListConverter implements Converter {
    private readonly unipeptCommunicator: UnipeptCommunicator;
    private readonly keggCommunicator: KeggCommunicator;

    constructor(
        private readonly progressListener: ProgressListener = defaultProgressListener
    ) {
        this.unipeptCommunicator = new UnipeptCommunicator(this.progressListener);
        this.keggCommunicator = new KeggCommunicator();
    }

    public isPeptide() {
        return false;
    }

    public async convert(proteinList: string[]) {
        // Split proteins and intensities
        const proteins = []
        const proteinsToIntensities = new Map<string, number>();
        for (const protein of proteinList) {
            const [ accession, intensity ] = protein.split("\t");
            proteins.push(accession);
            proteinsToIntensities.set(accession, parseFloat(intensity));
        }

        const proteinInfo = await this.unipeptCommunicator.fetchProteinInfo(proteins);

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
                            items: new Map<String, number>(),
                            taxon_id: info.taxon_id,
                            taxon_name: info.taxon_name,
                            taxon_rank: info.taxon_rank,
                            ec: ec.ec_number,
                            pathway: pathway.id,
                            pathwayName: pathway.name,
                            count: 0
                        };
                    }

                    if (!entry.items.has(info.protein)) {
                        entry.items.set(info.protein, 0);
                    }
                    entry.items.set(info.protein, entry.items.get(info.protein) + proteinsToIntensities.get(info.protein));

                    entry.count += 1;

                    resultMapping.set(key, entry);
                }
            }

            //this.progressListener.onProgressUpdate((i + 1) / proteinInfoLength);
        }

        return Array.from(resultMapping.values());
    }
}
