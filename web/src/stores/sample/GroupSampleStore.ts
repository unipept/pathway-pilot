import { defineStore } from 'pinia';

import { computed, ref } from 'vue';
import useMultiSampleStore from './MultiSampleStore';

const useGroupSampleStore = defineStore('groupSampleStore', () => {
    // This variable ensures that we only create UNIQUE stores
    let _counter = 0;

    // ===============================================================
    // ======================== REFERENCES ===========================
    // ===============================================================

    const groups = ref<any[]>([]);

    // ===============================================================
    // ========================= COMPUTED ============================
    // ===============================================================

    const initialized = computed(() => groups.value.some(group => group.initialized));

    const pathways = computed(() =>
        new Set(groups.value.map(group => [ ...group.pathways ]).flat())
    );

    const ecs = computed(() =>
        new Set(groups.value.map(group => [ ...group.ecs ]).flat())
    );

    const compounds = computed(() =>
        new Set(groups.value.map(group => [ ...group.compounds ]).flat())
    );

    // ===============================================================
    // ========================== METHODS ============================
    // ===============================================================

    const group = (index: number) => {
        return groups.value[index];
    };

    const addGroup = () => {
        groups.value = [ ...groups.value, useMultiSampleStore(`groupSampleStore_group${_counter++}`, `Group ${_counter}`) ];
        return groups.value.length - 1;
    };

    const removeGroup = (index: number) => {
        groups.value = [ ...groups.value.slice(0, index), ...groups.value.slice(index + 1) ];
    };

    const addSample = (groupIndex: number, sampleName: string) => {
        groups.value = [ ...groups.value ];
        return [ groupIndex, groups.value[groupIndex].addSample(sampleName) ];
    };

    const initializeSample = (groupIndex: number, sampleIndex: number, inputList: any[], sampleConverter: any) => {
        groups.value[groupIndex].initializeSample(sampleIndex, inputList, sampleConverter);
    };

    const removeSample = (groupIndex: number, sampleIndex: number) => {
        groups.value = [ ...groups.value ];
        groups.value[groupIndex].removeSample(sampleIndex);
    };

    const resetGroup = (index: number) => {
        groups.value[index].reset();
    };

    const reset = () => {
        groups.value.forEach(group => group.reset());
        groups.value = [];
    }

    const taxon = (taxonId: number) => {
        for (const group of groups.value) {
            const taxon = group.taxon(taxonId);
            if (taxon) {
                return taxon;
            }
        }
        return undefined;
    };

    const ecToPathways = (ec: string) => {
        return new Set(groups.value.map(group => [ ...group.ecToPathways(ec) ]).flat());
    };

    const pathwayToPeptideCounts = (pathway: string) => {
        return groups.value.map(group => group.pathwayToPeptideCounts(pathway)).reduce((a, b) => a + b, 0);
    };

    const compoundToPathways = (compound: string) => {
        return new Set(groups.value.map(group => [ ...group.compoundToPathways(compound) ]).flat());
    };

    return {
        groups,
        initialized,
        pathways,
        ecs,
        compounds,

        group,
        addGroup,
        removeGroup,
        addSample,
        initializeSample,
        removeSample,
        resetGroup,
        reset,

        taxon,
        ecToPathways,
        pathwayToPeptideCounts,
        compoundToPathways
    };
});

export default useGroupSampleStore;
