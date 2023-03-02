import { defineStore } from "pinia";
import {ref, reactive} from "vue";

const useVisualisationStore = defineStore('visualisationStore', () => {
    // Keep track of already fetched pathways
    const pathwayData = reactive<Map<string, Promise<any>>>(new Map());

    // Currently selected pathway and taxa
    const pathwayId = ref<string | undefined>(undefined);
    const highlightedTaxa = ref<number[]>([]);

    const getPathwayData = () => {
        return pathwayData.get(pathwayId.value ?? "");
    }

    const setPathwayId = (id: string | undefined) => {
        pathwayId.value = id;

        if (id && !pathwayData.has(id)) {
            pathwayData.set(id, fetch(
                `http://localhost:4000/pathway/${id}`
            ).then(res => res.json()));
        }
    }

    const setHighlightedTaxa = (taxa: number[]) => {
        highlightedTaxa.value = taxa;
    }

    const reset = () => {
        pathwayId.value = undefined;
        highlightedTaxa.value = [];
        pathwayData.clear();
    }

    return {
        pathwayId,
        highlightedTaxa,
        setPathwayId,
        setHighlightedTaxa,
        getPathwayData,
        reset
    };
});

export default useVisualisationStore;
