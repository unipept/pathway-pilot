import { defineStore } from 'pinia';

import Taxon from "@/logic/entities/Taxon";
import { computed, reactive, ref } from 'vue';
import { TreeviewItem, defaultTreeviewItem } from '@/components/visualisations/TreeviewItem';
import useKeggStore from '../KeggStore';

const useSingleSampleStore = (sampleId: string = 'single-sample', sampleName: string = '') => defineStore(`singleSampleStore/${sampleId}`, () => {
    const keggStore = useKeggStore();
    
    // ===============================================================
    // ======================== VARIABLES ============================
    // ===============================================================

    const _peptides = new Set<string>();
    const _taxa     = new Map<number, Taxon>();

    const _peptideToTaxa = new Map<string, Taxon>();
    const _peptideToPathways = new Map<string, Set<string>>();
    const _peptideToCounts = new Map<string, number>();

    const _taxonToEcs = new Map<number, Set<string>>();

    const _pathwayToTaxa = new Map<string, Set<number>>();
    const _pathwayToPeptideCounts = new Map<string, number>();

    const _ecToPathways = new Map<string, Set<string>>();
    const _ecToPeptides = new Map<string, Set<string>>();

    const _compoundToPathways = new Map<string, Set<string>>();

    // ===============================================================
    // ======================== REFERENCES ===========================
    // ===============================================================

    const uploadName = ref<string>(sampleName);
    const name = ref<string>(sampleName);
    const size = ref<number>(0);

    const processing = ref<number | false>(0);

    const pathways = reactive<Set<string>>(new Set());
    const ecs = reactive<Set<string>>(new Set());
    const compounds = reactive<Set<string>>(new Set());

    const taxaTree = ref<TreeviewItem>(defaultTreeviewItem);

    // ===============================================================
    // ========================= COMPUTED ============================
    // ===============================================================

    const initialized = computed(() => processing.value === false);

    // ===============================================================
    // ========================== METHODS ============================
    // ===============================================================

    const initialize = async (inputList: any[], sampleConverter: any) => {
        size.value = inputList.length;

        await keggStore.fetchPathwayMapping();

        const sampleData = await new sampleConverter({
            onProgressUpdate: (progress: number) => {
                processing.value = Math.round(progress * 100);
            }
        }).convert(inputList);

        if (initialized.value) {
            return;
        }

        for (const object of sampleData) {
            let taxon = _taxa.get(object.taxon_id);
            if (!taxon) {
                taxon = new Taxon(object.taxon_id, object.taxon_name, object.taxon_rank);
                _taxa.set(object.taxon_id, taxon);
            }

            const ec = object.ec;
            ecs.add(ec);

            const pathway = object.pathway;
            pathways.add(pathway);

            for (const compound of keggStore.pathwayMapping.get(pathway).compoundIds) {
                compounds.add(compound);

                if (!_compoundToPathways.has(compound)) {
                    _compoundToPathways.set(compound, new Set());
                }
                _compoundToPathways.get(compound)!.add(pathway);
            }

            if (!_taxonToEcs.has(object.taxon_id)) {
                _taxonToEcs.set(object.taxon_id, new Set());
            }
            _taxonToEcs.get(object.taxon_id)!.add(ec);

            if (!_pathwayToTaxa.has(object.pathway)) {
                _pathwayToTaxa.set(object.pathway, new Set());
            }
            _pathwayToTaxa.get(object.pathway)!.add(taxon.id);

            if (!_pathwayToPeptideCounts.has(object.pathway)) {
                _pathwayToPeptideCounts.set(object.pathway, 0);
            }
            _pathwayToPeptideCounts.set(object.pathway, _pathwayToPeptideCounts.get(object.pathway)! + object.count);

            if (!_ecToPathways.has(object.ec)) {
                _ecToPathways.set(object.ec, new Set());
            }
            _ecToPathways.get(object.ec)!.add(pathway);

            for (const [ peptide, count ] of object.items) {
                _peptides.add(peptide);

                _peptideToCounts.set(peptide, count);

                _peptideToTaxa.set(peptide, taxon);

                if (!_peptideToPathways.has(peptide)) {
                    _peptideToPathways.set(peptide, new Set());
                }
                _peptideToPathways.get(peptide)!.add(pathway);

                if (!_ecToPeptides.has(ec)) {
                    _ecToPeptides.set(ec, new Set());
                }
                _ecToPeptides.get(ec)!.add(peptide);
            }
        }

        processing.value = false;
    }

    const updateName = (newName: string) => {
        name.value = newName;
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

                if (_taxa.has(node.id)) {
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
        // Clear data
        _peptides.clear();
        _taxa.clear();

        _peptideToTaxa.clear();
        _peptideToPathways.clear();
        _peptideToCounts.clear();

        _taxonToEcs.clear();

        _pathwayToTaxa.clear();
        _pathwayToPeptideCounts.clear();

        _ecToPathways.clear();
        _ecToPeptides.clear();

        // Clear refs
        processing.value = 0;

        pathways.clear();
        ecs.clear();

        taxaTree.value = defaultTreeviewItem;
    }

    const peptides = () => [ ..._peptides ];

    const taxa = () => [ ..._taxa.keys() ];

    const taxon = (taxonId: number) => _taxa.get(taxonId);

    const peptideToTaxon = (peptide: string) => _peptideToTaxa.get(peptide);

    const peptideToPathways = (peptide: string) => [ ..._peptideToPathways.get(peptide) ?? [] ];

    const peptideToCounts = (peptide: string) => _peptideToCounts.get(peptide) ?? 0;

    const taxonToEcs = (taxonId: number) => [ ..._taxonToEcs.get(taxonId) ?? [] ];

    const pathwayToTaxa = (pathway: string) => [ ..._pathwayToTaxa.get(pathway) ?? [] ];

    const pathwayToPeptideCounts = (pathway: string) => _pathwayToPeptideCounts.get(pathway) ?? 0;

    const ecToPathways = (ec: string) => [ ..._ecToPathways.get(ec) ?? [] ];

    const ecToPeptides = (ec: string) => [ ..._ecToPeptides.get(ec) ?? [] ];

    const compoundToPathways = (compound: string) => [ ..._compoundToPathways.get(compound) ?? [] ];
    
    return {
        uploadName,
        name,
        size,
        processing,
        pathways,
        ecs,
        compounds,
        taxaTree,
        initialized,

        initialize,
        updateName,
        updateTree,
        children,
        reset,

        peptides,
        taxa,
        taxon,
        peptideToTaxon,
        peptideToPathways,
        peptideToCounts,
        taxonToEcs,
        pathwayToTaxa,
        pathwayToPeptideCounts,
        ecToPathways,
        ecToPeptides,
        compoundToPathways
    };
})();

export default useSingleSampleStore;
