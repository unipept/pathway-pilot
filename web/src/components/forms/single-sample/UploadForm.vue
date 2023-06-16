<template>
    <v-card flat>
        <v-card-text class="pa-0">
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
                        :label="label"
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
import FileInput from '../../inputs/FileInput.vue';
import { useFileReader } from '@/composables/useFileReader';

export interface Props {
    label: string
    example: string[]
    loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
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
    emits("reset");
    emits("submit", peptidesList.value);
};

const onClear = () => {
    peptides.value = "";
    peptideFile.value = undefined;
    emits("reset");
};

const onUpload = async (file: File) => {
    peptideFile.value = file;
    peptides.value = await readTextFile(file);
};

const onLoadExample = () => {
    peptideFile.value = undefined;
    peptides.value = props.example.join("\n");
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

:deep(textarea) {
    font-family: monospace;
    white-space: nowrap;
}
</style>
