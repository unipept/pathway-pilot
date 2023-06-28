import { defineStore } from 'pinia';

import { ref } from 'vue';
import useMultiSampleStore from './MultiSampleStore';

const useGroupSampleStore = defineStore('groupSampleStore', () => {
    // This variable ensures that we only create UNIQUE stores
    let _counter = 0;

    const groups = ref<any[]>([]);

    const addGroup = () => {
        groups.value = [ ...groups.value, useMultiSampleStore(`groupSampleStore_group${_counter++}`, `Group ${_counter}`) ];
        return groups.value.length - 1;
    };

    const removeGroup = (index: number) => {
        groups.value = [ ...groups.value.slice(0, index), ...groups.value.slice(index + 1) ];
    };

    const addSample = (groupIndex: number, sampleName: string) => {
        return [ groupIndex, groups.value[groupIndex].addSample(sampleName) ];
    };

    const initializeSample = (groupIndex: number, sampleIndex: number, inputList: any[], sampleConverter: any) => {
        groups.value[groupIndex].initializeSample(sampleIndex, inputList, sampleConverter);
    };

    const removeSample = (groupIndex: number, sampleIndex: number) => {
        groups.value[groupIndex].removeSample(sampleIndex);
    };

    return {
        groups,
        addGroup,
        removeGroup,
        addSample,
        initializeSample,
        removeSample,
    };
});

export default useGroupSampleStore;
