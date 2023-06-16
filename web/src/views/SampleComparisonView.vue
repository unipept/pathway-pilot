<template>
    <v-timeline
        density="compact"
        side="end"
        align="start"
    >
        <v-timeline-item
            dot-color="primary"
        >
            <template v-slot:icon>1</template>
            <h2>Upload your samples</h2>
        </v-timeline-item>

        <v-timeline-item
            dot-color="primary"
            size="20"
            fill-dot
            width="100%"
        >
            <h4>Select your input format</h4>
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

        <v-timeline-item
            dot-color="primary"
            width="100%"
        >
            <template v-slot:icon>2</template>
            <h2>Select your pathway</h2>
            <pathway-selection-view />
        </v-timeline-item>

        <v-timeline-item
            dot-color="primary"
            width="100%"
        >
            <template v-slot:icon>3</template>
            <h2>Analyse your pathway</h2>
            <visualisation-view />
        </v-timeline-item>
    </v-timeline>
</template>

<script setup lang="ts">
import PathwaySelectionView from './multi-sample-stepper/PathwaySelectionView.vue';
import useVisualisationStore from '@/stores/VisualisationStore';
import VisualisationView from './multi-sample-stepper/VisualisationView.vue';
import useMultiSampleStore from '@/stores/MultiSampleStore';
import InputSelectionView from './multi-sample-stepper/InputSelectionView.vue';
import UploadView from './multi-sample-stepper/UploadView.vue';
import { ref, watch } from 'vue';
import FileFormat from './FileFormat';

const { reset: resetMultiSampleStore } = useMultiSampleStore();
const { reset: resetVisualisationStore } = useVisualisationStore();

const fileFormat = ref<FileFormat>(FileFormat.PEPTIDE_LIST);

resetMultiSampleStore();
resetVisualisationStore();

watch(() => fileFormat.value, (newVal: FileFormat) => {
    resetMultiSampleStore();
    resetVisualisationStore();
});
</script>
