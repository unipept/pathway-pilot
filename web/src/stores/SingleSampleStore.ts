import { defineStore } from 'pinia';

import Taxon from "@/logic/entities/Taxon";
import EcNumber from "@/logic/entities/EcNumber";
import Pathway from "@/logic/entities/Pathway";
import { reactive, ref } from 'vue';

const useSingleSampleStore = (sampleId: string) => defineStore(`singleSampleStore/${sampleId}`, () => {
    // Mappings containing all matched entities
    const taxa     = new Map<number, Taxon>();
    const pathways = reactive<Map<string, Pathway>>(new Map());
    const ecs      = new Map<string, EcNumber>();

    const taxaToPathways = new Map<number, Set<Pathway>>();
    const taxaToEcs      = new Map<number, Set<EcNumber>>();

    const pathwaysToEcs  = new Map<string, Set<EcNumber>>();
    const pathwaysToTaxa = reactive<Map<string, Set<Taxon>>>(new Map());

    const pathwaysToPeptideCounts = new Map<string, number>();

    const initialized = ref<boolean>(false);

    const initialize = (infoObjects: any[]) => {
        if (initialized.value) {
            return;
        }

        for (const object of infoObjects) {
            let taxon = taxa.get(object.taxon_id);
            if (!taxon) {
                taxon = new Taxon(object.taxon_id, object.taxon_name, object.taxon_rank);
                taxa.set(object.taxon_id, taxon);
            }

            let ec = ecs.get(object.ec);
            if (!ec) {
                ec = new EcNumber(object.ec);
                ecs.set(object.ec, ec);
            }

            let pathway = pathways.get(object.pathway);
            if (!pathway) {
                pathway = new Pathway(object.pathway);
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

        initialized.value = true;

        console.log("MappingStore initialized");
    }

    const reset = () => {
        initialized.value = false;

        taxa.clear();

        console.log(taxa);
        pathways.clear();
        ecs.clear();

        taxaToPathways.clear();
        taxaToEcs.clear();

        pathwaysToEcs.clear();
        pathwaysToTaxa.clear();

        pathwaysToPeptideCounts.clear();
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

        initialized,

        initialize,
        reset
    };
})();

export default useSingleSampleStore;
