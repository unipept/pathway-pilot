import { defineStore, Store } from 'pinia';

import { computed, reactive, ref } from 'vue';
import useSingleSampleStore from './SingleSampleStore';

const useMultiSampleStore = defineStore('multiSampleStore', () => {
    // This variable ensures that we only create UNIQUE stores
    let _counter = 0;

    const samples = ref<any[]>([]);

    const initialized = computed(() => {
        return samples.value.length > 0 && samples.value.some(sample => sample.initialized);
    });

    const filtered = computed(() => {
        return samples.value.length > 0 && samples.value.some(sample => sample.filtered);
    });

    const addSample = (sampleName: string) => {
        samples.value.push(useSingleSampleStore(`multiSampleStore_sample${_counter++}`, sampleName));
        return samples.value.length - 1;
    };

    const initializeSample = (index: number, inputList: any[], sampleConverter: any) => {
        samples.value[index].initialize(inputList, sampleConverter);
    };

    const resetSample = (index: number) => {
        samples.value[index].reset();
    };

    const removeSample = (index: number) => {
        // TODO: destroy the store
        samples.value.splice(index, 1);
    };

    const reset = () => {
        samples.value.forEach(sample => sample.reset());
        samples.value = [];
    }

    const pathways = computed(() => {
        const pathways = new Set<string>();

        samples.value.forEach(sample =>
            sample.pathways.forEach((pathway: string) => pathways.add(pathway))
        );

        return pathways;
    });

    const filteredPathways = computed(() => {
        const pathways = new Set<string>();

        samples.value.forEach(sample =>
            sample.filteredPathways.forEach((pathway: string) => pathways.add(pathway))
        );

        return pathways;
    });

    const pathwaysToPeptideCounts = computed(() => {
        const pathwaysToPeptideCounts = new Map<string, number>();

        samples.value.forEach(sample =>
            sample.pathwaysToPeptideCounts.forEach((count: number, pathway: string) => {
                if (pathwaysToPeptideCounts.has(pathway)) {
                    pathwaysToPeptideCounts.set(pathway, pathwaysToPeptideCounts.get(pathway)! + count);
                } else {
                    pathwaysToPeptideCounts.set(pathway, count);
                }
            })
        );

        return pathwaysToPeptideCounts;
    });

    return {
        samples,
        initialized,
        filtered,
        addSample,
        initializeSample,
        resetSample,
        removeSample,
        reset,
        pathways,
        filteredPathways,
        pathwaysToPeptideCounts
    };
});

export default useMultiSampleStore;
