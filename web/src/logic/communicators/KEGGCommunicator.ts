import ParsedFile from "@/logic/parser/ParsedFile";

export default class KEGGCommunicator {
    private static readonly COLORS = [
        "red",
        "blue",
        "green",
        "yellow"
    ];

    constructor(
        private readonly parsedFile: ParsedFile
    ) {}

    /**
     * Returns the URL to retrieve an image of the given pathway ID from the KEGG API on which all enzymes that are
     * associated with the list of highlighted taxa will be highlighted. If no taxa to be highlighted are given, all
     * nodes will look the same.
     *
     * @param pathwayId
     * @param highlightedTaxa
     */
    getKEGGMap(
        pathwayId: string,
        highlightedTaxa?: number[]
    ) {
        const highlightedEcs: Map<string, number> = new Map();
        if (highlightedTaxa && highlightedTaxa.length > 0) {
            for (const taxonId of highlightedTaxa) {
                const ecSet = this.parsedFile.taxaToEcs.get(taxonId);
                if (ecSet) {
                    for (const ec of ecSet) {
                        highlightedEcs.set(ec.id, taxonId);
                    }
                }
            }
        }

        const urlParams = [];
        for (const [ec, taxonId] of highlightedEcs.entries()) {
            urlParams.push(`${ec}%09,${KEGGCommunicator.COLORS[highlightedTaxa?.indexOf(taxonId) ?? 0]}`);
        }

        return `https://www.kegg.jp/kegg-bin/show_pathway?${pathwayId}/${urlParams.join("/")}/multi`
    }
}
