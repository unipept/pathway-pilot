import { Compound } from "./Compound";
import { EcNumber } from "./EcNumber";
import { KeggMap } from "./KeggMap";
import { KoNumber } from "./KoNumber";
import { Reaction } from "./Reaction";

const koRegex: RegExp = /K\d{5}/;       /* Regex for KO numbers */
const cpdRegex: RegExp = /C\d{5}/;      /* Regex for compound numbers */
const rnRegex: RegExp = /R\d{5}/;       /* Regex for reaction numbers */
const mapRegex: RegExp = /map\d{5}:/;   /* Regex for map numbers */
const ecRegex: RegExp = /(\d+\.)+\d+/;  /* Regex for EC numbers */

export default class NodeInformation {
    private ecNumbers: EcNumber[];      /* EC numbers */
    private koNumbers: KoNumber[];      /* KO numbers */
    private reactions: Reaction[];      /* Reactions */
    private compounds: Compound[];      /* Compounds */
    private keggMaps: KeggMap[];        /* Kegg maps */

    constructor(
        title: string,                  /* Title of the node */
    ) {
        this.ecNumbers = [];
        this.koNumbers = [];
        this.reactions = [];
        this.compounds = [];
        this.keggMaps  = [];

        this.parseTitle(title);
    }

    private parseTitle(title: string): void {
        const items = title.trim().split(',').flatMap(item => item.trim().split(' '));

        for (const item of items) {
            const id = item.trim();

            if (koRegex.test(id)) {
                this.koNumbers.push({ id: id, name: 'TODO' });
            } else if (cpdRegex.test(id)) {
                this.compounds.push({ id: id, name: 'TODO' });
            } else if (rnRegex.test(id)) {
                this.reactions.push({ id: id });
            } else if (mapRegex.test(id)) {
                this.keggMaps.push({ id: id, name: 'TODO' });
            } else if (ecRegex.test(id)) {
                this.ecNumbers.push({ id: id });
            }
        }
    }
}
