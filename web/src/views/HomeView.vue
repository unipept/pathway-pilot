<template>
    <v-container>
        <p class="mb-5 text-justify">
            Van 't pathje is a taxonomy assignment and pathway visualisation tool for metaproteomics data. It combines <a href="https://unipept.ugent.be">UniPept</a> and <a href="https://www.kegg.jp">KEGG</a> to provide pathway visualisations showing which pathways are represented in which species. It works both with peptide and protein input. 
        </p>

        <p class="mb-5 text-justify">
            Input: Comma separated file with one peptide or protein (UniProt Accession) per line. Optional: A second column with weights (e.g. quantification values). <br>
            <u>Example Peptides:</u><br>
            IIIGDDEHGWDDEGVFNFEGGCYAK <br>
            AIESPIYHIAANAGIEGSVIINK <br> 
            Info: UniPept works with peptides of length 5-50, shorter/longer peptides will be ignored.
            <br>
            <u>Example Proteins:</u><br> 
            P24928,1.4 <br>
            Q7DF80,2.2 <br>
            A0AVT1,3.0 <br>
        </p>

        <file-input />

        <v-btn class="mt-5 float-right" color="primary" @click="() => onContinue($router)" :disabled="!canContinue">
            Continue
        </v-btn>

        <v-btn class="me-5 mt-5 float-right" color="error" @click="() => fileStore.clear()" :disabled="!canContinue">
            <v-icon class="me-2">mdi-delete-outline</v-icon> Clear file
        </v-btn>
    </v-container>
</template>

<script lang="ts" setup>
import FileInput from '@/components/inputs/FileInput.vue';
import useFileStore from '@/stores/FileStore';
import { computed } from 'vue';
import {Router} from "vue-router";

const fileStore = useFileStore();

const canContinue = computed(() => {
    return fileStore.uploadedFile !== undefined;
});

const onContinue = async (router: Router) => {
    await fileStore.parse();
    await router.push("/selection");
};
</script>
