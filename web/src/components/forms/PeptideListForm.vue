<template>
    <v-card flat>
        <v-card-text>
            <h1 class="mb-3">Upload your peptide list</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

            <v-row class="mt-5 input-container">
                <v-col :class="{ 'loading': processing }">
                    <file-input v-model="peptideFile" @upload="onUpload" />
                </v-col>

                <span 
                    :class="{ 'loading': processing }"
                    class="d-flex flex-grow-0 align-center pb-5"
                >
                    OR
                </span>

                <v-col :class="{ 'loading': processing }">
                    <v-textarea
                        v-model="peptides"
                        label="Paste your peptide list here"
                        rows=7
                        no-resize
                        persistent-counter
                        :counter-value="() => peptidesList.length"
                    />
                </v-col>

                <v-progress-circular v-if="processing"
                    class="loading-spinner"
                    size="50"
                    width="5"
                    color="secondary"
                    indeterminate
                />
            </v-row>

            <div class="d-flex justify-end mt-3">
                <v-btn color="error" @click="onClear" :disabled="!hasList || processing">
                    <v-icon class="me-2">mdi-delete-outline</v-icon> Clear input
                </v-btn>

                <v-btn class="ms-3" color="primary" :disabled="!hasList || processing" @click="onSubmit">
                    Upload
                </v-btn>
            </div>
        </v-card-text>
    </v-card>

    <peptide-list-example @try-out="onTryOut" :disabled="processing" />
</template>

<script lang="ts" setup>
import PeptideListConverter from '@/logic/converters/PeptideListConverter';
import { computed, ref } from 'vue';
import FileInput from '../inputs/FileInput.vue';
import PeptideListExample from './examples/PeptideListExample.vue';
import { useFileReader } from '@/composables/useFileReader';
import useMappingStore from '@/stores/MappingStore';

const emits = defineEmits(["submit"]);

const { initialize, reset }   = useMappingStore();
const { readTextFile } = useFileReader();

const peptideFile = ref<File | undefined>(undefined);
const peptides = ref<string>("");
const processing = ref<boolean>(false);

const peptidesList = computed(() => {
    return peptides.value.split("\n").filter((peptide) => peptide.length > 0);
});

const hasList = computed(() => peptidesList.value.length > 0);

const submitPeptideList = async (peptides: string[]) => {
    return await new PeptideListConverter({ 
        onProgressUpdate: (progress) => {} 
    }).convert(peptides);
};

const onSubmit = async () => {    
    processing.value = true;

    reset();
    initialize(await submitPeptideList(peptidesList.value))
    emits("submit", true);

    processing.value = false;
};

const onUpload = async (file: File) => {
    peptideFile.value = file;
    peptides.value = await readTextFile(file);
};

const onClear = () => {
    peptideFile.value = undefined;
    peptides.value = "";
};

const onTryOut = (examplePeptides: string[]) => {
    onClear();
    peptides.value = examplePeptides.join("\n");
    onSubmit();
};
</script>

<style scoped>
.input-container {
    position: relative;
}

.loading {
    opacity: 0.2;
    cursor: default;
}

.loading-spinner {
    position: absolute;
    top: calc(50% - 10px);
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
