<template>
    <v-container>
        <h1>Welcome</h1>
        <p class="mb-5">
            Van 't pathje is a taxonomy assignment and pathway visualisation tool for metaproteomics data. It combines <a href="https://unipept.ugent.be">Unipept</a> and <a href="https://www.kegg.jp">KEGG</a> to provide pathway visualisations showing which pathways are represented in which species. It works both with peptide and protein input.
        </p>

        <FormSelector @submit="() => onSubmit($router)"/>
    </v-container>
</template>

<script lang="ts" setup>
import FormSelector from '@/components/forms/FormSelector.vue';
import { Router } from 'vue-router';

const onSubmit = async (router: Router) => {
    router.push('/selection');
};
</script>
