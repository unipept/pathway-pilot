import { defineStore } from "pinia";
import KeggCommunicator from "@/logic/communicators/KEGGCommunicator";
import { ref } from "vue";

const useKeggStore = defineStore('keggStore', () => {
    const keggCommunicator = new KeggCommunicator();

    const pathwayMapping  = ref<any>(undefined);
    const koMapping       = ref<any>(undefined);
    const ecMapping       = ref<any>(undefined);
    const reactionMapping = ref<any>(undefined);
    const compoundMapping = ref<any>(undefined);

    const fetchPathwayMapping = async () => {
        pathwayMapping.value = await keggCommunicator.fetchPathwayMapping();
    };

    const fetchKoMapping = async () => {
        koMapping.value = await keggCommunicator.fetchKoMapping();
    };

    const fetchEcMapping = async () => {
        ecMapping.value = await keggCommunicator.fetchEcMapping();
    }

    const fetchReactionMapping = async () => {
        reactionMapping.value = await keggCommunicator.fetchReactionMapping();
    }

    const fetchCompoundMapping = async () => {
        compoundMapping.value = await keggCommunicator.fetchCompoundMapping();
    }

    return {
        pathwayMapping,
        koMapping,
        ecMapping,
        reactionMapping,
        compoundMapping,
        fetchPathwayMapping,
        fetchKoMapping,
        fetchEcMapping,
        fetchReactionMapping,
        fetchCompoundMapping
    }
});

export default useKeggStore;
