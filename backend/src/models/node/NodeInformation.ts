import { Compound } from "./Compound";
import { EcNumber } from "./EcNumber";
import { KeggMap } from "./KeggMap";
import { KoNumber } from "./KoNumber";
import { Reaction } from "./Reaction";

export default class NodeInformation {
    private ecNumbers: EcNumber[];          /* EC numbers */
    private koNumbers: KoNumber[];          /* KO numbers */
    private reactions: Reaction[];          /* Reactions */
    private compounds: Compound[];          /* Compounds */
    private keggMaps: KeggMap[];            /* Kegg maps */

    constructor(
        title: string,                      /* Title of the node */
    ) {
        this.ecNumbers = [];
        this.koNumbers = [];
        this.reactions = [];
        this.compounds = [];
        this.keggMaps  = [];

        this.parseTitle(title);
    }

    private parseTitle(title: string): void {
        for (const part of title.split(',')) {
            const trimmed = part.trim();

            if (trimmed.startsWith('map')) {
                const [ id, name ] = trimmed.split(' ');
                this.keggMaps.push({ id: id.slice(-1), name: name });
            }

            else if (trimmed.startsWith('K')) {
                const [ id, name ] = trimmed.split(' ');
                this.koNumbers.push({ id: id, name: name.slice(1, -1) });
            }

            else if (trimmed.startsWith('C')) {
                const [ id, name ] = trimmed.split(' ')
                this.compounds.push({ id: id, name: name.slice(1, -1) });
            }

            else if (trimmed.startsWith('R')) {
                this.reactions.push({ id: trimmed });
            }

            else {
                this.ecNumbers.push({ id: trimmed });
            }
        }
    }
}