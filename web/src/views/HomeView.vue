<template>
    <v-container>
        <h1>Welcome</h1>
        <p class="mb-5 text-justify">
            Van 't pathje is a taxonomy assignment and pathway visualisation tool for metaproteomics data. It combines <a href="https://unipept.ugent.be">UniPept</a> and <a href="https://www.kegg.jp">KEGG</a> to provide pathway visualisations showing which pathways are represented in which species. It works both with peptide and protein input.
        </p>

        <div class="my-12">
            <h1>Try it!</h1>

            <file-input />

            <v-btn class="mt-2 float-right" color="primary" @click="() => onContinue($router)" :disabled="!canContinue">
                Continue
            </v-btn>

            <v-btn class="me-5 mt-2 float-right" color="error" @click="() => fileStore.clear()" :disabled="!canContinue">
                <v-icon class="me-2">mdi-delete-outline</v-icon> Clear file
            </v-btn>
        </div>

        <h2>Input types</h2>

        <h3>Peptides</h3>
        <div>
            Comma separated file with one peptide or protein (UniProt Accession) per line.
            Optional: A second column with weights (e.g. quantification values).
        </div>

        <div class="text-overline mb-n2">Example</div>
        <v-textarea filled :value="peptideExample" readonly dense hide-details rows="4">
        </v-textarea>
        <span class="font-weight-bold text-caption">Info: </span>
        <span class="text-caption">UniPept works with peptides of length 5 - 50, shorter / longer peptides will be ignored.</span>

        <h3 class="mt-2">Proteins</h3>
        <div class="text-overline mb-n2">Example</div>
        <v-textarea filled :value="proteinExample" readonly dense hide-details rows="3">
        </v-textarea>
    </v-container>
</template>

<script lang="ts" setup>
import FileInput from '@/components/inputs/FileInput.vue';
import useFileStore from '@/stores/FileStore';
import { computed } from 'vue';
import {Router} from "vue-router";

const fileStore = useFileStore();

const peptideExample = "AIESPIYHIAANAGIEGSVIINK\nIIIGDDEHGWDDEGVFNFEGGCYAK\nMEVAVGDKVIYSK\nTEGNYVVVNYSAEPATSDELDR";
const proteinExample = "P24928,1.4\nQ7DF80,2.2\nA0AVT1,3.0";

const canContinue = computed(() => {
    return fileStore.uploadedFile !== undefined;
});

const onContinue = async (router: Router) => {
    await fileStore.parse();
    await router.push("/selection");
};
</script>
