<template>
    <div v-if="url" class="d-flex justify-center">
        <v-img :src="url"/>
        <div class="legend ml-2">
            <span class="text-h6">Legend</span>
            <div v-if="visualisationStore.highlightedTaxa.length === 0">
                No species selected to highlight...
            </div>
            <div>
                <div v-for="taxon of visualisationStore.highlightedTaxa" :key="taxon" class="d-flex">
                    <div :style="{ width: '20px', height: '20px', background: computeTaxonColor(taxon) }" class="mr-2"></div>
                    <span>{{ fileStore.parsedFile?.taxa.get(taxon).name }}</span>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="d-flex flex-column align-center">
        <img src="@/assets/loading_animation.gif" />
        <p>Loading...</p>
    </div>

    <v-btn class="mt-5" color="primary" @click="() => onBack($router)">
        Back
    </v-btn>
</template>

<script setup lang="ts">
import KEGGCommunicator from '@/logic/communicators/KEGGCommunicator';
import useFileStore from '@/stores/FileStore';
import useVisualisationStore from '@/stores/VisualisationStore';
import {onMounted, ref} from "vue";
import ColorConstants from "@/logic/constants/ColorConstants";
import { Router } from 'vue-router';

const fileStore = useFileStore();
const visualisationStore = useVisualisationStore();

const url = ref<string | undefined>(undefined);

const keggCommunicator = new KEGGCommunicator(fileStore.parsedFile!);

onMounted(async () => {
    url.value = await keggCommunicator.getKEGGMapUrl(visualisationStore.pathwayId!, visualisationStore.highlightedTaxa!);
});

const computeTaxonColor = (taxonId: number) => {
    return ColorConstants.LEGEND[visualisationStore.highlightedTaxa.indexOf(taxonId)];
}

const onBack = (router: Router) => {
    router.push("/selection");
};
</script>
