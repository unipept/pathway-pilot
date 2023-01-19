<template>
    <v-container>
        <p class="mb-5 text-justify">
            Van 't pathje is a taxonomy assignment and pathway visualisation tool for metaproteomics data. It combines UniPept and KEGG to provide pathway visualisations showing which pathways are represented in which species. It works both with peptide and protein input.
        </p>

        <p class="mb-5 text-justify">
            Input: 
        </p>

        <file-input />

        <v-btn class="mt-5 float-right" color="primary" @click="() => onContinue($router)" >
            Continue
        </v-btn>

        <v-btn class="me-5 mt-5 float-right" color="error" @click="() => fileStore.clear()">
            <v-icon class="me-2">mdi-delete-outline</v-icon> Clear file
        </v-btn>
    </v-container>
</template>

<script lang="ts" setup>
import FileInput from '@/components/inputs/FileInput.vue';
import useFileStore from '@/stores/FileStore';
import {Router} from "vue-router";

const fileStore = useFileStore();

const onContinue = async (router: Router) => {
    await fileStore.parse();
    await router.push("/selection");
};
</script>
