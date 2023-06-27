import { defineStore } from 'pinia';

import { ref } from 'vue';
import useMultiSampleStore from './MultiSampleStore';

const useGroupSampleStore = defineStore('groupSampleStore', () => {
    // This variable ensures that we only create UNIQUE stores
    let _counter = 0;

    const groups = ref<any[]>([]);

    const addGroup = (groupName: string) => {
        groups.value = [ ...groups.value, useMultiSampleStore(`groupSampleStore_group${_counter++}`, groupName) ];
        return groups.value.length - 1;
    };

    const removeGroup = (index: number) => {
        groups.value = [ ...groups.value.slice(0, index), ...groups.value.slice(index + 1) ];
    };

    const addSampleToGroup = (groupIndex: number, sampleName: string) => {
        groups.value[groupIndex].addSample(sampleName);
    };

    return {
        groups,
        addGroup,
        removeGroup,
    };
});

export default useGroupSampleStore;
