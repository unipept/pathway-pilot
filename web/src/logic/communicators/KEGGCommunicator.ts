import ParsedFile from "@/logic/parser/ParsedFile";

export default class KEGGCommunicator {
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

        const url = `https://www.kegg.jp/kegg-bin/show_pathway?map00400/1.14.16.1%09,blue/1.14.16.1%09,red/multi`
    }
}
