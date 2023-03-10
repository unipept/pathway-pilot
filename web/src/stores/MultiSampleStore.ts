import { defineStore } from 'pinia';

import Taxon from "@/logic/entities/Taxon";
import EcNumber from "@/logic/entities/EcNumber";
import Pathway from "@/logic/entities/Pathway";
import { reactive, ref } from 'vue';
import useSingleSampleStore from './SingleSampleStore';

const useMultiSampleStore = defineStore('multiSampleStore', () => {
    const sample1 = useSingleSampleStore('sample1');
    const sample2 = useSingleSampleStore('sample2');

    // TODO
});

export default useMultiSampleStore;
