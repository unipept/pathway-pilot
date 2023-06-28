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

    const pathways = computed(() =>
        new Set(samples.value.map(sample => [ ...sample.pathways ]).flat())
    );

    const ecs = computed(() => 
        new Set(samples.value.map(sample => [ ...sample.ecs ]).flat())
    );

    // ===============================================================
    // ========================== METHODS ============================
    // ===============================================================

    const addSample = (sampleName: string) => {
        samples.value = [ ...samples.value, useSingleSampleStore(`multiSampleStore_sample${_counter++}`, sampleName) ];
        return samples.value.length - 1;
    };

    const initializeSample = (index: number, inputList: any[], sampleConverter: any) => {
        samples.value[index].initialize(inputList, sampleConverter);
    };

    const removeSample = (index: number) => {
        // TODO: destroy the store
        samples.value = [ ...samples.value.slice(0, index), ...samples.value.slice(index + 1) ]
    };

    const resetSample = (index: number) => {
        samples.value[index].reset();
    };

    const reset = () => {
        samples.value.forEach(sample => sample.reset());
        samples.value = [];
    }

    const updateName = (newName: string) => {
        name.value = newName;
    };

    const updateSampleName = (index: number, newName: string) => {
        samples.value[index].updateName(newName);
    };

    const ecToPathways = (ec: string) => {
        return new Set(samples.value.map(sample => [ ...(sample.ecToPathways.get(ec) ?? []) ]).flat());
    };

    const ecToPeptides = (ec: string) => {
        return new Set(samples.value.map(sample => [ ...(sample.ecToPeptides.get(ec) ?? []) ]).flat());
    };

    const pathwayToPeptideCounts = (pathway: string) => {
        return samples.value.map(sample => sample.pathwaysToPeptideCounts.get(pathway) ?? 0).reduce((a, b) => a + b, 0);
    };

    const peptideToCounts = (peptide: string) => {
        return samples.value.map(sample => sample.peptideToCounts.get(peptide) ?? 0).reduce((a, b) => a + b, 0);
    };

    return {
        name,
        samples,
        initialized,
        pathways,
        ecs,

        addSample,
        initializeSample,
        removeSample,
        resetSample,
        reset,

        ecToPathways,
        ecToPeptides,
        pathwayToPeptideCounts,
        peptideToCounts,

        updateName,
        updateSampleName
    };
})();

export default useMultiSampleStore;
