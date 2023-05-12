import { defineStore } from 'pinia';

import Taxon from "@/logic/entities/Taxon";
import { reactive, ref } from 'vue';

const useSingleSampleStore = (sampleId: string = 'single-sample', sampleName: string = '') => defineStore(`singleSampleStore/${sampleId}`, () => {
    const name    = ref<string>(sampleName);
    const size    = ref<number>(0);
    const rawData = ref<any[]>([]);

    // Mappings containing all matched entities
    const taxa     = new Map<number, Taxon>();
    const pathways = reactive<Set<string>>(new Set());
    const ecs      = reactive<Set<string>>(new Set());

    const taxaToPathways = new Map<number, Set<string>>();
    const taxaToEcs      = new Map<number, Set<string>>();

    const pathwaysToEcs  = new Map<string, Set<string>>();
    const pathwaysToTaxa = reactive<Map<string, Set<number>>>(new Map());
    const pathwaysToPeptideCounts = new Map<string, number>();

    const ecToPathways = new Map<string, Set<string>>();

    const taxaTree = ref<any>(undefined);

    const initialized = ref<boolean>(false);

    // Mapping filters
    const filtered = ref<boolean>(false);
    const filteredPathways = reactive<Set<string>>(new Set());

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

            const ec = object.ec;
            ecs.add(ec);

            const pathway = object.pathway;
            pathways.add(pathway);

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
            pathwaysToTaxa.get(object.pathway)!.add(taxon.id);

            if (!pathwaysToPeptideCounts.has(object.pathway)) {
                pathwaysToPeptideCounts.set(object.pathway, 0);
            }
            pathwaysToPeptideCounts.set(object.pathway, pathwaysToPeptideCounts.get(object.pathway)! + object.count);

            if (!ecToPathways.has(object.ec)) {
                ecToPathways.set(object.ec, new Set());
            }
            ecToPathways.get(object.ec)!.add(pathway);
        }

        initialized.value = true;
    }

    const setTree = async (tree: any) => {
        taxaTree.value = tree;
    }

    const children = (taxonId: number) => {
        const collectChildren = (root: any) => {
            const children = [];

            const nodes = [ ...root.children ];
            while (nodes.length > 0) {
                const node = nodes.pop();

                if (taxa.has(node.id)) {
                    children.push(node.id);
                }

                nodes.push(...node.children);
            }

            return children;
        }

        const nodes = [ taxaTree.value ];
        while (nodes.length > 0) {
            const node = nodes.pop();

            if (node.id === taxonId) {
                return collectChildren(node);
            }

            nodes.push(...node.children);
        }

        return [];
    }

    const reset = () => {
        initialized.value = false;

        taxa.clear();

        pathways.clear();
        ecs.clear();

        taxaToPathways.clear();
        taxaToEcs.clear();

        pathwaysToEcs.clear();
        pathwaysToTaxa.clear();
        pathwaysToPeptideCounts.clear();

        ecToPathways.clear();
    }

    const updateFilter = (pathways: string[]) => {
        filteredPathways.clear();

        for (const pathway of pathways) {
            filteredPathways.add(pathway);
        }

        filtered.value = filteredPathways.size > 0;
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
        ecToPathways,
        pathwaysToPeptideCounts,
        taxaTree,

        filtered,
        filteredPathways,

        initialized,

        initialize,
        setTree,
        reset,
        children,

        updateFilter
    };
})();

export default useSingleSampleStore;
