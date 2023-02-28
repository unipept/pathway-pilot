<template>
    <h1 class="mb-3">Upload your peptide list</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

    <v-row class="mt-5 input-container">
        <v-col :class="{ 'loading': processing }">
            <file-input
                v-model="peptideFile"
                :disabled="hasList"
                @upload="onUpload" 
            />
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
                :counter-value="() => peptidesList.length"
                no-resize
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

    <div class="d-flex justify-end mt-1">
        <v-btn color="error" @click="onClear" :disabled="!hasFile && !hasList">
            <v-icon class="me-2">mdi-delete-outline</v-icon> Clear input
        </v-btn>

        <v-btn class="ms-3" color="primary" @click="onSubmit" :disabled="!hasFile && !hasList">
            Upload
        </v-btn>
    </div>

    <peptide-list-example class="mt-5" />
</template>

<script lang="ts" setup>
import PeptideListConverter from '@/logic/converters/PeptideListConverter';
import { computed, ref } from 'vue';
import FileInput from '../inputs/FileInput.vue';
import PeptideListExample from './examples/PeptideListExample.vue';
import { useFileReader } from '@/composables/useFileReader';
import useMappingStore from '@/stores/MappingStore';

const emits = defineEmits(["submit"]);

const  { initialize } = useMappingStore();

const { readTextFile } = useFileReader();

const peptideFile = ref<File | undefined>(undefined);
const peptides = ref<string>("");
const processing = ref<boolean>(false);

const peptidesList = computed(() => {
    return peptides.value.split("\n").filter((peptide) => peptide.length > 0);
});

const hasFile = computed(() => {
    return peptideFile.value !== undefined;
});

const hasList = computed(() => {
    return peptidesList.value.length > 0;
});

const submitList = async (peptides: string[]) => {
    const converter = new PeptideListConverter({
        onProgressUpdate: (progress) => {
            // TODO: show progress
            //console.log(progress);
        }
    });

    return await converter.convert(peptides);
};

const submitFile = async () => {
    const text = await readTextFile(peptideFile.value!);

    return await submitList(text.trimEnd().split("\n"));
};

const onUpload = (file: File) => {
    peptideFile.value = file;
};

const onClear = () => {
    peptideFile.value = undefined;
    peptides.value = "";
};

const onSubmit = async () => {
    processing.value = true;

    if (hasList.value) {
        initialize(await submitList(peptidesList.value));
    } else if (hasFile.value) {
        initialize(await submitFile());
    }

    emits("submit", true);

    processing.value = false;
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
