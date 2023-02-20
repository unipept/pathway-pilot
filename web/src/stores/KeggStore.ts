import { defineStore } from "pinia";
import KeggCommunicator from "@/logic/communicators/KeggCommunicator";
import { ref } from "vue";

const useKeggStore = defineStore('keggStore', () => {
    const keggCommunicator = new KeggCommunicator();

    let koMapping = ref<any>(undefined);
    let ecMapping: any = undefined;

    const fetchKoMapping = async () => {
        koMapping.value = await keggCommunicator.fetchKoMapping();
    };

    const fetchEcMapping = async () => {
        if (!ecMapping) {
            return;
        }

        ecMapping = await keggCommunicator.fetchEcMapping();
    }

    return {
        koMapping,
        ecMapping,
        fetchKoMapping,
        fetchEcMapping
    }
});

export default useKeggStore;
