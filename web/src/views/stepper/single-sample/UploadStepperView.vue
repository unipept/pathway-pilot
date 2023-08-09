<template>
    <v-timeline-item dot-color="primary">
        <template v-slot:icon>{{ step }}</template>
        <h2>Upload your sample</h2>
    </v-timeline-item>

    <v-timeline-item
        dot-color="primary"
        size="20"
        fill-dot
        width="100%"
    >
        <input-selection-view v-model="fileFormat" />
    </v-timeline-item>

    <v-timeline-item
        dot-color="primary"
        size="20"
        fill-dot
        width="100%"
    >
        <upload-view :file-format="fileFormat" />
    </v-timeline-item>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import FileFormat from '../FileFormat';
import InputSelectionView from '../InputSelectionView.vue';
import UploadView from './upload/UploadView.vue';
import useSingleSampleStore from '@/stores/sample/SingleSampleStore';
import useVisualisationStore from '@/stores/VisualisationStore';

export interface Props {
    step: number;
};

defineProps<Props>();

const { reset: resetSingleSampleStore } = useSingleSampleStore();
const { reset: resetVisualisationStore } = useVisualisationStore();

const fileFormat = ref<FileFormat>(FileFormat.PEPTIDE_LIST);

watch(() => fileFormat.value, () => {
    resetSingleSampleStore();
    resetVisualisationStore();
});
</script>
