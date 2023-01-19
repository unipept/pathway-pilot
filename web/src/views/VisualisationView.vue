<template>
    <p>Tis hier van t' pathje</p>
    <img src="https://www.kegg.jp/tmp/mark_pathway1674133523117155/ec00592.png"/>
    <img v-if="url" :src="url"/>

    <!--    <img src="https://unipept.ugent.be/assets/desktop_docs/unipept_desktop_windows_1-80a95ea11a4f2c9eac15fc49cf63c8b17caecbcee366e476277bb275bce35c2b.png" />-->
<!--    <v-img src="https://www.kegg.jp/tmp/mark_pathway1674133523117155/ec00592.png">-->

<!--    </v-img>-->
</template>

<script setup lang="ts">
import KEGGCommunicator from '@/logic/communicators/KEGGCommunicator';
import useFileStore from '@/stores/FileStore';
import useVisualisationStore from '@/stores/VisualisationStore';
import {onMounted} from "vue";

const fileStore = useFileStore();
const visualisationStore = useVisualisationStore();

const keggCommunicator = new KEGGCommunicator(fileStore.parsedFile!);

let url;

onMounted(async () => {
    url = await keggCommunicator.getKEGGMapUrl(visualisationStore.pathwayId!, visualisationStore.highlightedTaxa!);
    console.log(url);
});
</script>
