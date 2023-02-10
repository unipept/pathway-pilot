import { defineStore } from 'pinia';

import Taxon from "@/logic/entities/Taxon";
import EcEntry from "@/logic/entities/EcEntry";
import PathwayEntry from "@/logic/entities/PathwayEntry";

const useMappingStore = defineStore('mappingStore', () => {
    const taxa = new Map<number, Taxon>();
    const pathways: Map<string, PathwayEntry> = new Map();
    const ecs: Map<string, EcEntry> = new Map();

    const taxaToPathways: Map<number, Set<PathwayEntry>> = new Map();
    const taxaToEcs: Map<number, Set<EcEntry>> = new Map();

    const pathwaysToEcs: Map<string, Set<EcEntry>> = new Map();
    const pathwaysToTaxa: Map<string, Set<Taxon>> = new Map();

    const pathwaysToPeptideCounts: Map<string, number> = new Map();

    const initialize = (infoObjects: any[]) => {
        for (const object of infoObjects) {
            let taxon = taxa.get(object.taxon_id);
            if (!taxon) {
                taxon = new Taxon(object.taxon_id, object.taxon_name, object.taxon_rank);
                taxa.set(object.taxon_id, taxon);
            }

            let ec = ecs.get(object.ec);
            if (!ec) {
                ec = new EcEntry(object.ec);
                ecs.set(object.ec, ec);
            }

            let pathway = pathways.get(object.pathway);
            if (!pathway) {
                pathway = new PathwayEntry(object.pathway);
                pathways.set(object.pathway, pathway);
            }

            if (!taxaToPathways.has(object.taxon_id)) {
                taxaToPathways.set(object.taxon_id, new Set());
            }
            taxaToPathways.get(object.taxon_id)!.add(pathway);

            if (!taxaToEcs.has(object.taxon_id)) {
                taxaToEcs.set(object.taxon_id, new Set());
            }
            taxaToEcs.get(object.taxon_id)!.add(ec);

            if (!pathwaysToEcs.has(object.pathway)) {
                pathwaysToEcs.set(object.pathway, new Set());
            }
            pathwaysToEcs.get(object.pathway)!.add(ec);

            if (!pathwaysToTaxa.has(object.pathway)) {
                pathwaysToTaxa.set(object.pathway, new Set());
            }
            pathwaysToTaxa.get(object.pathway)!.add(taxon);

            if (!pathwaysToPeptideCounts.has(object.pathway)) {
                pathwaysToPeptideCounts.set(object.pathway, 0);
            }
            pathwaysToPeptideCounts.set(object.pathway, pathwaysToPeptideCounts.get(object.pathway)! + object.count);
        }

        console.log("MappingStore initialized");
    }

    return {
        taxa,
        pathways,
        ecs,
        taxaToPathways,
        taxaToEcs,
        pathwaysToEcs,
        pathwaysToTaxa,
        pathwaysToPeptideCounts,

        initialize
    };
});

export default useMappingStore;
