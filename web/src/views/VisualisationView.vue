<template>
    <v-img :src="url">

    </v-img>
</template>

<script setup lang="ts">
import KEGGCommunicator from '@/logic/communicators/KEGGCommunicator';
import useFileStore from '@/stores/FileStore';
import useVisualisationStore from '@/stores/VisualisationStore';

const fileStore = useFileStore();
const visualisationStore = useVisualisationStore();

const keggCommunicator = new KEGGCommunicator(fileStore.parsedFile!);

const url = keggCommunicator.getKEGGMap(visualisationStore.pathwayId!, visualisationStore.highlightedTaxa!);
</script>
