import Pathway from "@/logic/entities/Pathway";
import Taxon from "@/logic/entities/Taxon";
import { defineStore } from "pinia";
import {ref, reactive} from "vue";
import { API_BASE_URL } from "@/logic/constants/ApiConstants";

const useVisualisationStore = defineStore('visualisationStore', () => {
    // Keep track of already fetched pathways
    const pathwayData = reactive<Map<string, Promise<any>>>(new Map());

    // Currently selected pathway
    const pathway = ref<Pathway | undefined>(undefined);

    // Currently highlighted groups
    const highlightedItems = ref<number[]>([]);

    const getPathwayData = () => {
        return pathwayData.get(pathway.value?.id ?? "");
    }

    const setPathway = (newPathway: Pathway | undefined) => {
        pathway.value = newPathway;

        const id = newPathway?.id;
        if (id && !pathwayData.has(id)) {
            pathwayData.set(id, fetch(
                `${API_BASE_URL}/pathway/${id}`
            ).then(res => res.json()));
        }
    }

    const setHighlightedItems = (items: number[]) => {
        highlightedItems.value = items;
    }

    const reset = () => {
        pathway.value = undefined;
        highlightedItems.value = [];

        pathwayData.clear();
    }

    return {
        pathway,
        highlightedItems,
        setPathway,
        setHighlightedItems,
        getPathwayData,
        reset
    };
});

export default useVisualisationStore;
