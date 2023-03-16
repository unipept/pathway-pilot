<template>
    <v-card flat>
        <v-card-text>
            <h1 class="mb-3">Upload a list of peptides</h1>
            <p class="subtitle">
                Provide a list of tryptic peptides by either pasting your sequences on the right or selecting a single <span>.txt</span> 
                file. Each line of input will be interpreted as a single sequence and can't contain any special characters. Have a look 
                at the example below to get a feel about the input format.
            </p>

            <p class="subtitle mt-3">
                Two processing steps will happen whenever you upload your data:
                <ol class="ms-5">
                    <li class="ms-5">
                        Each input line will be analyzed with <resource-link url="https://unipept.ugent.be/">Unipept</resource-link>. 
                        this results is list of functional annotations and taxa per sequence.  <b>Note: Unipept works with peptides of 
                        length 5 - 50. Shorter and longer peptides will be ignored</b>.
                    </li>
                    <li class="ms-5">
                        Each functional annotation gets mapped onto zero or more <resource-link url="https://www.genome.jp/kegg/pathway.html">Kegg pathways</resource-link>.
                    </li>
                </ol>
            </p>

            <v-row class="mt-5 input-container">
                <v-col :class="{ 'loading': loading }">
                    <file-input v-model="peptideFile" @upload="onUpload" />
                </v-col>

                <span 
                    :class="{ 'loading': loading }"
                    class="d-flex flex-grow-0 align-center pb-5"
                >
                    OR
                </span>

                <v-col :class="{ 'loading': loading }">
                    <v-textarea
                        v-model="peptides"
                        label="Paste your peptide list here"
                        rows=7
                        no-resize
                        persistent-counter
                        :counter-value="() => peptidesList.length"
                    />
                </v-col>

                <v-progress-circular v-if="loading"
                    class="loading-spinner"
                    size="50"
                    width="5"
                    color="primary"
                    indeterminate
                />
            </v-row>

            <div class="d-flex justify-end mt-3">
                <v-btn color="error" @click="onClear" variant="outlined" :disabled="!hasList || loading">
                    <v-icon class="me-2">mdi-delete-outline</v-icon> Clear input
                </v-btn>

                <v-btn class="ms-3" color="primary" variant="outlined" :disabled="loading" @click="onLoadExample">
                    Load example
                </v-btn>

                <v-btn class="ms-3" color="primary" :disabled="!hasList || loading" @click="onSubmit">
                    Upload
                </v-btn>
            </div>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import FileInput from '../inputs/FileInput.vue';
import { useFileReader } from '@/composables/useFileReader';
import ResourceLink from '../misc/ResourceLink.vue';

import example from "./examples/PeptideListExample";

export interface Props {
    loading: boolean;
}

withDefaults(defineProps<Props>(), {
    loading: false
});

const emits = defineEmits(["submit", "reset"]);

const { readTextFile } = useFileReader();

const peptides = ref<string>("");
const peptideFile = ref<File | undefined>(undefined);

const peptidesList = computed(() => {
    return peptides.value.split("\n").filter((peptide) => peptide.length > 0);
});

const hasList = computed(() => peptidesList.value.length > 0);

const onSubmit = async () => {
    onReset();
    emits("submit", peptidesList.value);
};

const onReset = () => {
    emits("reset");
};

const onClear = () => {
    peptides.value = "";
    peptideFile.value = undefined;
    onReset();
};

const onUpload = async (file: File) => {
    peptideFile.value = file;
    peptides.value = await readTextFile(file);
};

const onLoadExample = () => {
    peptideFile.value = undefined;
    peptides.value = example.join("\n");
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

.subtitle {
    font-size: 16px;
    color: #454545;
}
</style>
