import { defineStore } from 'pinia';

import { computed, ref } from 'vue';
import useSingleSampleStore from './SingleSampleStore';

// This variable ensures that we only create UNIQUE stores
// This variable NEEDS to be global to the sample store, otherwise we will get duplicate stores
let _counter = 0;

const useMultiSampleStore = (sampleId: string = 'multi-sample', sampleName: string = '') => defineStore(`multiSampleStore/${sampleId}`, () => {
    // ===============================================================
    // ======================== REFERENCES ===========================
    // ===============================================================

    const name = ref<string>(sampleName);

    const samples = ref<any[]>([]);

    // ===============================================================
    // ========================= COMPUTED ============================
    // ===============================================================

    const initialized = computed(() => samples.value.some(sample => sample.initialized));

    const empty = computed(() => samples.value.length === 0);

    const pathways = computed(() =>
        new Set(samples.value.map(sample => [ ...sample.pathways ]).flat())
    );

    const ecs = computed(() => 
        new Set(samples.value.map(sample => [ ...sample.ecs ]).flat())
    );

    // ===============================================================
    // ========================== METHODS ============================
    // ===============================================================

    const updateName = (newName: string) => {
        name.value = newName;
    };

    const updateSampleName = (index: number, newName: string) => {
        samples.value[index].updateName(newName);
    };
    
    const addSample = (sampleName: string) => {
        samples.value = [ ...samples.value, useSingleSampleStore(`multiSampleStore_sample${_counter++}`, sampleName) ];
        return samples.value.length - 1;
    };

    const initializeSample = (index: number, inputList: any[], sampleConverter: any) => {
        samples.value[index].initialize(inputList, sampleConverter);
    };

    const removeSample = (index: number) => {
        resetSample(index);
        samples.value = [ ...samples.value.slice(0, index), ...samples.value.slice(index + 1) ]
    };

    const resetSample = (index: number) => {
        samples.value[index].reset();
    };

    const reset = () => {
        samples.value.forEach(sample => sample.reset());
        samples.value = [];
    }

    const taxon = (taxonId: number) => {
        for (const sample of samples.value) {
            const taxon = sample.taxon(taxonId);
            if (taxon) {
                return taxon;
            }
        }
        return undefined;
    };

    const taxonToEcs = (taxon: string) => {
        return new Set(samples.value.map(sample => sample.taxonToEcs(taxon)).flat());
    };

    const ecToPathways = (ec: string) => {
        return new Set(samples.value.map(sample => sample.ecToPathways(ec)).flat());
    };

    const ecToPeptides = (ec: string) => {
        return new Set(samples.value.map(sample => sample.ecToPeptides(ec)).flat());
    };

    const pathwayToTaxa = (pathway: string) => {
        return new Set(samples.value.map(sample => sample.pathwayToTaxa(pathway)).flat());
    };

    const pathwayToPeptideCounts = (pathway: string) => {
        return samples.value.map(sample => sample.pathwayToPeptideCounts(pathway)).reduce((a, b) => a + b, 0);
    };

    const peptideToCounts = (peptide: string) => {
        return samples.value.map(sample => sample.peptideToCounts(peptide)).reduce((a, b) => a + b, 0);
    };

    return {
        name,
        samples,
        initialized,
        empty,
        pathways,
        ecs,

        updateName,
        updateSampleName,
        addSample,
        initializeSample,
        removeSample,
        resetSample,
        reset,

        taxon,
        taxonToEcs,
        ecToPathways,
        ecToPeptides,
        pathwayToTaxa,
        pathwayToPeptideCounts,
        peptideToCounts
    };
})();

export default useMultiSampleStore;
