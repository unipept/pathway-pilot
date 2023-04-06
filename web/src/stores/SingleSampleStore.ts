import { defineStore } from 'pinia';

import Taxon from "@/logic/entities/Taxon";
import EcNumber from "@/logic/entities/EcNumber";
import Pathway from "@/logic/entities/Pathway";
import { reactive, ref } from 'vue';
import UnipeptCommunicator from '@/logic/communicators/UnipeptCommunicator';

const useSingleSampleStore = (sampleId: string, sampleName: string = '') => defineStore(`singleSampleStore/${sampleId}`, () => {
    const name    = ref<string>(sampleName);
    const size    = ref<number>(0);
    const rawData = ref<any[]>([]);

    // Mappings containing all matched entities
    const taxa     = new Map<number, Taxon>();
    const pathways = reactive<Map<string, Pathway>>(new Map());
    const ecs      = new Map<string, EcNumber>();

    const taxaToPathways = new Map<number, Set<Pathway>>();
    const taxaToEcs      = new Map<number, Set<EcNumber>>();

    const pathwaysToEcs  = new Map<string, Set<EcNumber>>();
    const pathwaysToTaxa = reactive<Map<string, Set<Taxon>>>(new Map());

    const pathwaysToPeptideCounts = new Map<string, number>();

    const taxaTree = ref<any>(undefined);

    const initialized = ref<boolean>(false);

    const initialize = (sampleData: any[], rawSampleData: any[]) => {
        size.value = rawSampleData.length;
        rawData.value = rawSampleData;

        if (initialized.value) {
            return;
        }

        for (const object of sampleData) {
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

    const setTree = async (tree: any) => {
        taxaTree.value = tree;
    }

    const ancestors = (taxonId: number) => {
        const visited   = new Set<number>();

        const recursive = (current: any, ancestors: Set<number>): Set<number> => {
            visited.add(current.id);

            if (current.id === taxonId) {
                return ancestors;
            }

            ancestors.add(current.id);

            for (const child of current.children) {
                // Look for the target inside the not yet processed children
                if (!visited.has(child.id)) {
                    const updatedAncestors = recursive(child, ancestors);

                    // This set would be empty if no progress was made in the subtree
                    if (updatedAncestors.size > 0) {
                        return updatedAncestors;
                    }
                }
            }

            // No suitable child found in this subtree, so remove the current node from the ancestors
            ancestors.delete(current.id);

            // No progress made in this subtree, so return an empty set
            return new Set<number>();
        }

        return Array.from(recursive(taxaTree.value, new Set()));
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
        name,
        size,
        taxa,
        pathways,
        ecs,
        taxaToPathways,
        taxaToEcs,
        pathwaysToEcs,
        pathwaysToTaxa,
        pathwaysToPeptideCounts,
        taxaTree,

        initialized,

        initialize,
        setTree,
        reset,
        ancestors
    };
})();

export default useSingleSampleStore;
