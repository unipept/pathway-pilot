import { defineStore } from "pinia";
import KeggCommunicator from "@/logic/communicators/KeggCommunicator";
import { ref } from "vue";

const useKeggStore = defineStore('keggStore', () => {
    const keggCommunicator = new KeggCommunicator();

    const koMapping       = ref<any>(undefined);
    const ecMapping       = ref<any>(undefined);
    const reactionMapping = ref<any>(undefined);
    const compoundMapping = ref<any>(undefined);

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
        koMapping,
        ecMapping,
        reactionMapping,
        compoundMapping,
        fetchKoMapping,
        fetchEcMapping,
        fetchReactionMapping,
        fetchCompoundMapping
    }
});

export default useKeggStore;
