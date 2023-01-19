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
    async getKEGGMapUrl(
        pathwayId: string,
        highlightedTaxa?: number[]
    ): Promise<string> {
        const highlightedEcs: Map<string, number[]> = new Map();
        if (highlightedTaxa && highlightedTaxa.length > 0) {
            for (const taxonId of highlightedTaxa) {
                const ecSet = this.parsedFile.taxaToEcs.get(taxonId);
                if (ecSet) {
                    for (const ec of ecSet) {
                        if (!highlightedEcs.has(ec.id)) {
                            highlightedEcs.set(ec.id, []);
                        }
                        highlightedEcs.get(ec.id)!.push(taxonId);
                    }
                }
            }
        }

        const urlParams = [];
        for (const [ec, taxa] of highlightedEcs.entries()) {
            for (const taxon of taxa) {
                urlParams.push(`${ec}%09${KEGGCommunicator.COLORS[highlightedTaxa?.indexOf(taxon) ?? 0]},black`);
            }
        }

        const fullUrl = `https://www.kegg.jp/kegg-bin/show_pathway?${pathwayId.replace("path:", "")}/${urlParams.join("/")}/multi/nocolor`;
        const response = await fetch(fullUrl);

        const contents = await response.text();
        const path = contents.match(/(\/tmp\/mark_pathway[^"]*)/)![0]
        return `https://www.kegg.jp${path}`;
    }
}
