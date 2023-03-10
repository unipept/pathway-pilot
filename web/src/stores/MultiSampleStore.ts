import EcNumber from '@/logic/entities/EcNumber';
import Pathway from '@/logic/entities/Pathway';
import Taxon from '@/logic/entities/Taxon';
import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';

const useMultiSampleStore = defineStore('multiSampleStore', () => {
    const pathways = reactive<Map<string, Pathway>>(new Map());
    const ecs      = new Map<string, EcNumber>();

    const pathwaysToEcs  = new Map<string, Set<EcNumber>>();
    const pathwaysToTaxa = reactive<Map<string, Set<Taxon>>>(new Map());

    const pathwaysToPeptideCounts = new Map<string, number>();

    const initialized = ref<boolean>(false);

    const initialize = (infoObjects: any[]) => {
        if (initialized.value) {
            return;
        }

        for (const object of infoObjects) {
            let ec = ecs.get(object.ec);
            if (!ec) {
                ec = new EcNumber(object.ec);
                ecs.set(object.ec, ec);
            }

            let pathway = pathways.get(object.pathway);
            if (!pathway) {
                pathway = new Pathway(object.pathway);
                pathways.set(object.pathway, pathway);
            }

            if (!pathwaysToEcs.has(object.pathway)) {
                pathwaysToEcs.set(object.pathway, new Set());
            }
            pathwaysToEcs.get(object.pathway)!.add(ec);

            if (!pathwaysToPeptideCounts.has(object.pathway)) {
                pathwaysToPeptideCounts.set(object.pathway, 0);
            }
            pathwaysToPeptideCounts.set(object.pathway, pathwaysToPeptideCounts.get(object.pathway)! + object.count);
        }

        initialized.value = true;
    }

    const reset = () => {
        initialized.value = false;

        pathways.clear();
        ecs.clear();

        pathwaysToEcs.clear();
        pathwaysToTaxa.clear();

        pathwaysToPeptideCounts.clear();
    }

    return {
        pathways,
        ecs,
        pathwaysToEcs,
        pathwaysToTaxa,
        pathwaysToPeptideCounts,

        initialized,

        initialize,
        reset
    };
});

export default useMultiSampleStore;
