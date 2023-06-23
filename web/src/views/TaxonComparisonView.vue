<template>
    <v-timeline density="compact" side="end" align="start">
        <v-timeline-item dot-color="primary">
            <template v-slot:icon>1</template>
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
            <upload-view :file-format="fileFormat" @submit="resetVisualisationStore"/>
        </v-timeline-item>

        <v-timeline-item dot-color="primary" width="100%">
            <template v-slot:icon>2</template>
            <pathway-selection-view />
        </v-timeline-item>

        <v-timeline-item dot-color="primary" width="100%">
            <template v-slot:icon>3</template>
            <h2>Select your taxa <span style="font-size: small; color: #7a7a7a;">OPTIONAL</span></h2>
            <taxon-selection-view />
        </v-timeline-item>

        <v-timeline-item dot-color="primary" width="100%">
            <template v-slot:icon>4</template>
            <h2>Analyse your pathway</h2>
            <visualisation-view />
        </v-timeline-item>
    </v-timeline>
</template>

<script setup lang="ts">
import UploadView from './sample-stepper/single-sample-stepper/UploadView.vue';
import PathwaySelectionView from './sample-stepper/single-sample-stepper/PathwaySelectionView.vue';
import TaxonSelectionView from './sample-stepper/single-sample-stepper/TaxonSelectionView.vue';
import VisualisationView from './sample-stepper/single-sample-stepper/VisualisationView.vue';
import InputSelectionView from './sample-stepper/InputSelectionView.vue';
import useVisualisationStore from '@/stores/VisualisationStore';
import useSingleSampleStore from '@/stores/SingleSampleStore';
import FileFormat from './sample-stepper/FileFormat';
import { ref, watch } from 'vue';

const { reset: resetSingleSampleStore } = useSingleSampleStore();
const { reset: resetVisualisationStore } = useVisualisationStore();

const fileFormat = ref<FileFormat>(FileFormat.PEPTIDE_LIST);

resetSingleSampleStore();
resetVisualisationStore();

watch(() => fileFormat.value, (newVal: FileFormat) => {
    resetSingleSampleStore();
    resetVisualisationStore();
});
</script>
