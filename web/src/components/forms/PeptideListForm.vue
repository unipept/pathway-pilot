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
                    color="primary"
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

            <error-modal v-model="errors" />
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
import useSingleSampleStore from '@/stores/SingleSampleStore';
import ResourceLink from '../misc/ResourceLink.vue';
import PeptideListVerifier from '@/logic/verifiers/PeptideListVerifier';
import ErrorModal from '../modals/ErrorModal.vue';
import VerifierError from '@/logic/verifiers/VerifierError';

const emits = defineEmits(["submit"]);

const { initialize, reset: resetMappingStore }   = useSingleSampleStore();
const { readTextFile } = useFileReader();

const peptideFile = ref<File | undefined>(undefined);
const peptides = ref<string>("");
const processing = ref<boolean>(false);

const errors = ref<VerifierError[]>([]);

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

    resetMappingStore();

    errors.value = new PeptideListVerifier().verify(peptidesList.value);

    if (errors.value.length === 0) {
        emits("submit", true);
        initialize(await submitPeptideList(peptidesList.value))
    }

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

.subtitle {
    font-size: 16px;
    color: #454545;
}
</style>
