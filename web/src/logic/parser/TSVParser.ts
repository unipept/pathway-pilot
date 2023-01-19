import ParsedFile from "@/logic/parser/ParsedFile";
import Taxon from "@/logic/entities/Taxon";
import ECEntry from "@/logic/entities/ECEntry";
import PathwayEntry from "@/logic/entities/PathwayEntry";

export default class TSVParser {
    private readonly LCA_ID_COLUMN_IDX = 1;
    private readonly LCA_RANK_COLUMN_IDX = 2;
    private readonly LCA_NAME_COLUMN_IDX = 3;
    private readonly EC_COLUMN_IDX = 4;
    private readonly PEPT_COUNT_COLUMN_IDX = 5;
    private readonly PATHWAY_COLUMN_ID = 6;


    parse(fileContents: string): ParsedFile {
        const taxa: Map<number, Taxon> = new Map();
        const pathways: Map<string, PathwayEntry> = new Map();
        const ecs: Map<string, ECEntry> = new Map();

        const taxaToPathways: Map<number, Set<PathwayEntry>> = new Map();
        const taxaToEcs: Map<number, Set<ECEntry>> = new Map();

        const pathwaysToEcs: Map<string, Set<ECEntry>> = new Map();
        const pathwaysToTaxa: Map<string, Set<Taxon>> = new Map();

        const pathwaysToPeptideCounts: Map<string, number> = new Map();

        const inputLines = fileContents.split("\n");

        for (const line of inputLines.slice(1)) {
            const fields = line.split(",");

            const taxaId = parseInt(fields[this.LCA_ID_COLUMN_IDX]);
            let taxonObj: Taxon;

            if (!taxa.has(taxaId)) {
                taxonObj = new Taxon(
                    taxaId,
                    fields[this.LCA_NAME_COLUMN_IDX],
                    fields[this.LCA_RANK_COLUMN_IDX],
                );

                taxa.set(taxaId, taxonObj);
            } else {
                taxonObj = taxa.get(taxaId)!;
            }

            const ecId = fields[this.EC_COLUMN_IDX];
            let ecObj: ECEntry;

            if (!ecs.has(ecId)) {
                ecObj = new ECEntry(ecId);
                ecs.set(ecId, ecObj);
            } else {
                ecObj = ecs.get(ecId)!;
            }

            const pathwayId = fields[this.PATHWAY_COLUMN_ID];
            let pathwayObj: PathwayEntry;
            
            if (!pathways.has(pathwayId)) {
                pathwayObj = new PathwayEntry(pathwayId);
                pathways.set(pathwayId, pathwayObj);
            } else {
                pathwayObj = pathways.get(pathwayId)!;
            }

            if (!taxaToPathways.has(taxaId)) {
                taxaToPathways.set(taxaId, new Set());
            }
            taxaToPathways.get(taxaId)!.add(pathwayObj);

            if (!taxaToEcs.has(taxaId)) {
                taxaToEcs.set(taxaId, new Set());
            }
            taxaToEcs.get(taxaId)!.add(ecObj);

            if (!pathwaysToEcs.has(pathwayId)) {
                pathwaysToEcs.set(pathwayId, new Set());
            }
            pathwaysToEcs.get(pathwayId)!.add(ecObj);

            if (!pathwaysToTaxa.has(pathwayId)) {
                pathwaysToTaxa.set(pathwayId, new Set());
            }
            pathwaysToTaxa.get(pathwayId)!.add(taxonObj);

            if (!pathwaysToPeptideCounts.has(pathwayId)) {
                pathwaysToPeptideCounts.set(pathwayId, 0);
            }
            pathwaysToPeptideCounts.set(pathwayId, pathwaysToPeptideCounts.get(pathwayId)! + parseInt(fields[this.PEPT_COUNT_COLUMN_IDX]));
        }

        return new ParsedFile(
            taxa,
            pathways,
            ecs,
            taxaToPathways,
            taxaToEcs,
            pathwaysToEcs,
            pathwaysToTaxa,
            pathwaysToPeptideCounts
        );
    }
}
