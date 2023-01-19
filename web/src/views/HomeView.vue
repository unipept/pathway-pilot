<template>
    <v-container>
        <p class="mb-5 text-justify">
           Van 't pathje is a taxonomy assignment and pathway visualisation tool for metaproteomics data. Given a list of peptides (e.g. the ones found with a search engine of your choice), it will use UniPept to assign proteins and taxa to the peptides and then highlight the proteins in the KEGG pathways that contain them.
        </p>

        <file-input />

        <v-btn class="mt-5 float-right" color="primary" to="/selection">
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

const fileStore = useFileStore();
</script>
