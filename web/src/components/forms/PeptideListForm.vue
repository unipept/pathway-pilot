<template>
    <h1>Upload your peptide list</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

    <v-row class="mt-5">
        <v-col>
            <file-input />
        </v-col>

        <span class="d-flex flex-grow-0 align-center pb-5">
            OR
        </span>

        <v-col>
            <v-textarea
                v-model="peptides"
                label="Peptide list"
                rows=7
                :counter-value="() => peptidesList.length"
                :loading="loading"
                clearable
                no-resize
            />
        </v-col>
    </v-row>

    <div class="d-flex justify-end mt-1">
        <v-btn 
            color="primary"
            @click="onSubmit"
        >
            Submit
        </v-btn>
    </div>

    <peptide-list-example class="mt-5" />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import FileInput from '../inputs/FileInput.vue';
import PeptideListExample from './examples/PeptideListExample.vue';

export interface Props {
    loading: boolean;
}

defineProps<Props>();

const emits = defineEmits(["submit"]);

const peptides = ref<string>("");

const peptidesList = computed(() => {
    return peptides.value.split("\n").filter((peptide) => peptide.length > 0);
});

const onSubmit = () => {
    emits("submit", peptidesList.value);
};
</script>
