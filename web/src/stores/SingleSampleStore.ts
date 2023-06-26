import { defineStore } from 'pinia';

import Taxon from "@/logic/entities/Taxon";
import { reactive, ref } from 'vue';
import { TreeviewItem, defaultTreeviewItem } from '@/components/visualisations/TreeviewItem';

const useSingleSampleStore = (sampleId: string = 'single-sample', sampleName: string = '') => defineStore(`singleSampleStore/${sampleId}`, () => {
    const name = ref<string>(sampleName);
    const size = ref<number>(0);

    // Mappings containing all matched entities
    const peptides = new Set<string>();
    const taxa     = new Map<number, Taxon>();
    const pathways = reactive<Set<string>>(new Set());
    const ecs      = reactive<Set<string>>(new Set());

    const peptideToTaxa     = new Map<string, Taxon>();
    const peptideToPathways = new Map<string, Set<string>>();
    const peptideToCounts   = new Map<string, number>();

    const taxaToPathways = new Map<number, Set<string>>();
    const taxaToEcs      = new Map<number, Set<string>>();
    const taxaToPeptides = new Map<number, Set<string>>();

    const pathwaysToEcs  = new Map<string, Set<string>>();
    const pathwaysToTaxa = reactive<Map<string, Set<number>>>(new Map());
    const pathwaysToPeptideCounts = new Map<string, number>();

    const ecToPathways = new Map<string, Set<string>>();
    const ecToPeptides = new Map<string, Set<string>>();

    const specificCounts = reactive<Map<string, number>>(new Map());

    const taxaTree = ref<TreeviewItem>(defaultTreeviewItem);

    const initialized = ref<boolean>(false);

    const initialize = async (inputList: any[], sampleConverter: any) => {
        size.value = inputList.length;

        const sampleData = await sampleConverter.convert(inputList);

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

            for (const [ peptide, count ] of object.items) {
                peptides.add(peptide);

                peptideToCounts.set(peptide, count);

                peptideToTaxa.set(peptide, taxon);

                if (!peptideToPathways.has(peptide)) {
                    peptideToPathways.set(peptide, new Set());
                }
                peptideToPathways.get(peptide)!.add(pathway);

                if (!taxaToPeptides.has(taxon.id)) {
                    taxaToPeptides.set(taxon.id, new Set());
                }
                taxaToPeptides.get(taxon.id)!.add(peptide);

                if (!ecToPeptides.has(ec)) {
                    ecToPeptides.set(ec, new Set());
                }
                ecToPeptides.get(ec)!.add(peptide);
            }

            const key = `${taxon.id}-${ec}`;
            if (!specificCounts.has(key)) {
                specificCounts.set(key, object.count);
            }
        }

        initialized.value = true;
    }

    const updateTree = (tree: TreeviewItem) => {
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
            const node = nodes.pop()!;

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

    return {
        name,
        size,

        peptides,
        taxa,
        pathways,
        ecs,

        peptideToTaxa,
        peptideToPathways,
        peptideToCounts,

        taxaToPathways,
        taxaToEcs,
        taxaToPeptides,

        pathwaysToEcs,
        pathwaysToTaxa,
        pathwaysToPeptideCounts,

        ecToPathways,
        ecToPeptides,

        taxaTree,

        initialized,

        initialize,
        updateTree,
        reset,
        children
    };
})();

export default useSingleSampleStore;
