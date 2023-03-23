import { defineStore } from 'pinia';

import Taxon from "@/logic/entities/Taxon";
import EcNumber from "@/logic/entities/EcNumber";
import Pathway from "@/logic/entities/Pathway";
import { reactive, ref } from 'vue';
import UnipeptCommunicator from '@/logic/communicators/UnipeptCommunicator';

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

    const taxaTree = ref<any>(undefined);

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

    const setTree = async (tree: any) => {
        taxaTree.value = tree;
    }

    const ancestors = (taxonId: number, pathwayId: string) => {
        const visited = new Set<any>();
        const toVisit = [taxaTree.value];
        const ancestors: any[] = [];

        while (toVisit.length > 0) {
            const current = toVisit.pop()!;
            visited.add(current);

            if (current.id === taxonId) {
                return ancestors;
            }

            ancestors.push(current);

            const childrenToVisit = current.children.filter((child: any) => !visited.has(child));

            if (childrenToVisit.length === 0) {
                ancestors.pop();
            }

            // Add the children to the queue
            toVisit.push(...childrenToVisit);
        }

        return [];
    }

    const descendants = (taxonId: number, pathwayId: string) => {
        const toVisit = [taxaTree.value];

        while (toVisit.length > 0) {
            const current = toVisit.pop()!;

            if (current.id === taxonId) {
                const ids = [...pathwaysToTaxa.get(pathwayId) ?? []].map((taxon: Taxon) => taxon.id);
                return getChildren(current, ids);
            }

            toVisit.push(...current.children);
        }

        return [];
    }

    const getChildren = (node: any, ids: number[]) => {
        return [
            ...node.children.filter((child: any) => ids.includes(child.id)), 
            ...node.children.flatMap((child: any) => getChildren(child, ids))
        ];
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
        taxaTree,

        initialized,

        initialize,
        setTree,
        reset,
        descendants,
        ancestors
    };
})();

export default useSingleSampleStore;
