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
        console.log(highlightedTaxa);

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
            urlParams.push(`${ec}%09white,${KEGGCommunicator.COLORS[highlightedTaxa?.indexOf(taxonId) ?? 0]}`);
        }

        const fullUrl = `https://www.kegg.jp/kegg-bin/show_pathway?${pathwayId.replace("path:", "")}/${urlParams.join("/")}/default%3dwhite/multi`;
        const response = await fetch(fullUrl);

        const contents = await response.text();
        const path = contents.match(/(\/tmp\/mark_pathway[^"]*)/)![0]
        return `https://www.kegg.jp${path}`;
    }
}
