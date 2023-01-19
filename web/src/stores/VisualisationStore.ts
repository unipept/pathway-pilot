import { defineStore } from "pinia";
import {ref} from "vue";

const useVisualisationStore = defineStore('visualisationStore', () => {
    const pathwayId = ref<string | undefined>(undefined);
    const highlightedTaxa = ref<number[]>([]);

    const setPathwayId = (id: string) => {
        pathwayId.value = id;
    }

    const setHighlightedTaxa = (taxa: number[]) => {
        highlightedTaxa.value = taxa;
    }

    return {
        pathwayId,
        highlightedTaxa,
        setPathwayId,
        setHighlightedTaxa
    };
});

export default useVisualisationStore;
