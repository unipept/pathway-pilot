import Pathway from '@/logic/entities/Pathway';
import { defineStore, Store } from 'pinia';

import { computed, reactive, ref } from 'vue';
import useSingleSampleStore from './SingleSampleStore';

const useMultiSampleStore = defineStore('multiSampleStore', () => {
    const samples = ref<any[]>([]);

    const initialized = computed(() => {
        return samples.value.length > 0 && samples.value.some(sample => sample.initialized);
    });

    const addSample = () => {
        samples.value.push(useSingleSampleStore(`multiSampleStore_sample${samples.value.length}`));
        return samples.value.length - 1;
    };

    const initializeSample = (index: number, infoObjects: any[]) => {
        samples.value[index].initialize(infoObjects);
    };

    const resetSample = (index: number) => {
        samples.value[index].reset();
    };

    const removeSample = (index: number) => {
        samples.value.splice(index, 1);
    };

    const reset = () => {
        samples.value.forEach(sample => sample.reset());
        samples.value = [];
    }

    const pathways = computed(() => {
        const pathways = new Map<string, Pathway>();

        samples.value.forEach(sample =>
            sample.pathways.forEach((pathway: Pathway) => pathways.set(pathway.id, pathway))
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
        addSample,
        initializeSample,
        resetSample,
        removeSample,
        reset,
        pathways,
        pathwaysToPeptideCounts
    };
});

export default useMultiSampleStore;
