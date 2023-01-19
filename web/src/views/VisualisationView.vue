<template>
    <p>Tis hier van t' pathje</p>
    <div v-if="url">
        <img :src="url"/>
    </div>
</template>

<script setup lang="ts">
import KEGGCommunicator from '@/logic/communicators/KEGGCommunicator';
import useFileStore from '@/stores/FileStore';
import useVisualisationStore from '@/stores/VisualisationStore';
import {onMounted, ref} from "vue";

const fileStore = useFileStore();
const visualisationStore = useVisualisationStore();

const url = ref<string | undefined>(undefined);

const keggCommunicator = new KEGGCommunicator(fileStore.parsedFile!);

onMounted(async () => {
    url.value = await keggCommunicator.getKEGGMapUrl(visualisationStore.pathwayId!, visualisationStore.highlightedTaxa!);
    console.log(url);
});
</script>
