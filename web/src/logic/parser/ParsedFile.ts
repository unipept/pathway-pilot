import Taxon from "@/logic/entities/Taxon";
import ECEntry from "@/logic/entities/ECEntry";
import PathwayEntry from "@/logic/entities/PathwayEntry";

export default class ParsedFile {
    constructor(
        public readonly taxa: Map<number, Taxon>,
        public readonly pathways: Map<string, PathwayEntry>,
        public readonly ecs: Map<string, ECEntry>,
        public readonly taxaToPathways: Map<number, PathwayEntry[]>,
        public readonly taxaToEcs: Map<number, ECEntry[]>,
        public readonly pathwaysToEcs: Map<string, ECEntry[]>
    ) {}
}
