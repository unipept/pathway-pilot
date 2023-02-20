import { defineStore } from "pinia";
import KeggCommunicator from "@/logic/communicators/KeggCommunicator";
import { ref } from "vue";

const useKeggStore = defineStore('keggStore', () => {
    const keggCommunicator = new KeggCommunicator();

    let koMapping       = ref<any>(undefined);
    let ecMapping       = ref<any>(undefined);
    let reactionMapping = ref<any>(undefined);

    const fetchKoMapping = async () => {
        koMapping.value = await keggCommunicator.fetchKoMapping();
    };

    const fetchEcMapping = async () => {
        ecMapping.value = await keggCommunicator.fetchEcMapping();
    }

    const fetchReactionMapping = async () => {
        reactionMapping.value = await keggCommunicator.fetchReactionMapping();
    }

    return {
        koMapping,
        ecMapping,
        reactionMapping,
        fetchKoMapping,
        fetchEcMapping,
        fetchReactionMapping
    }
});

export default useKeggStore;
