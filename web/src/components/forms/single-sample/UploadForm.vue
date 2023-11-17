<template>
    <v-card flat>
        <v-card-text class="information mb-3">
            <slot name="header"></slot>
        </v-card-text>

        <v-card-text class="information">
            <slot name="information"></slot>
        </v-card-text>

        <v-card-text>
            <v-row class="mt-1 input-container">
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
                        :label="label"
                        rows=7
                        no-resize
                        persistent-counter
                        :counter-value="() => peptidesList.length"
                    />
                </v-col>

                <progress-loader v-if="isLoading" class="loader" :loading="loading"/>
            </v-row>

            <v-row v-if="multi">
                <span class="pt-2 ps-3 pe-0">
                    Name your sample
                </span>
                <v-text-field
                    class="px-3"
                    v-model="sampleName"
                    density="compact"
                />
            </v-row>

            <div class="d-flex justify-end mt-3">
                <v-btn color="error" @click="onReset" variant="outlined" :disabled="!hasList || isLoading">
                    <v-icon class="me-2">mdi-delete-outline</v-icon> Clear input
                </v-btn>

                <v-btn class="ms-3" color="primary" variant="outlined" :disabled="isLoading" @click="onLoadExample">
                    Load example
                </v-btn>

                <v-btn class="ms-3" color="primary" :disabled="!hasList || isLoading" @click="onSubmit">
                    Upload
                </v-btn>
            </div>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import FileInput from '../../inputs/FileInput.vue';
import { useFileReader } from '@/composables/useFileReader';
import ProgressLoader from '@/components/misc/ProgressLoader.vue';

export interface Props {
    label: string
    example: string[]
    loading?: false | number
    multi?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    multi: false
});

const emits = defineEmits(["submit", "reset"]);

const { readTextFile } = useFileReader();

const peptides = ref<string>("");
const peptideFile = ref<File | undefined>(undefined);
const sampleName = ref<string>("");

const peptidesList = computed(() => {
    return peptides.value.split("\n").filter((peptide) => peptide.length > 0);
});

const isLoading = computed(() => !!props.loading);

const hasList = computed(() => peptidesList.value.length > 0);

const onSubmit = async () => {
    emits("reset");
    emits("submit", peptidesList.value, sampleName.value);
};

const onReset = () => {
    peptides.value = "";
    peptideFile.value = undefined;
    sampleName.value = "";
    emits("reset");
};

const onUpload = async (file: File) => {
    peptideFile.value = file;
    peptides.value = await readTextFile(file);
};

const onLoadExample = () => {
    peptideFile.value = undefined;
    peptides.value = props.example.join("\n");
    sampleName.value = "Example sample";
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

:deep(textarea) {
    font-family: monospace;
    white-space: nowrap;
}

.information {
    padding: 0;
    font-size: 16px;
}

.loader {
    position: absolute;
    top: calc(50% - 10px);
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
