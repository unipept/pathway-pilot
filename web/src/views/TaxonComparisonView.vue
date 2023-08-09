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
            <upload-view :file-format="fileFormat" />
        </v-timeline-item>

        <v-timeline-item dot-color="primary" width="100%">
            <template v-slot:icon>2</template>
            <pathway-selection-view @filtered="onPathwaysFiltered" />
        </v-timeline-item>

        <v-timeline-item dot-color="primary" width="100%">
            <template v-slot:icon>3</template>
            <visualisation-view v-model:area="selectedArea" />
        </v-timeline-item>

        <v-timeline-item v-if="pathway"
            dot-color="primary"
            size="20"
            fill-dot
            width="100%"
        >
            <advanced-analysis-view :area="selectedArea" />
        </v-timeline-item>

        <v-timeline-item dot-color="primary" width="100%">
            <template v-slot:icon>4</template>
            <export-view :pathways="filteredPathways" />
        </v-timeline-item>
    </v-timeline>
</template>

<script setup lang="ts">
import UploadView from './sample-stepper/single-sample-stepper/UploadView.vue';
import PathwaySelectionView from './sample-stepper/single-sample-stepper/PathwaySelectionView.vue';
import VisualisationView from './sample-stepper/single-sample-stepper/VisualisationView.vue';
import InputSelectionView from './sample-stepper/InputSelectionView.vue';
import ExportView from './sample-stepper/single-sample-stepper/ExportView.vue';
import useVisualisationStore from '@/stores/VisualisationStore';
import useSingleSampleStore from '@/stores/sample/SingleSampleStore';
import FileFormat from './sample-stepper/FileFormat';
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import AdvancedAnalysisView from './sample-stepper/single-sample-stepper/advanced/AdvancedAnalysisView.vue';

const { reset: resetSingleSampleStore } = useSingleSampleStore();
const { reset: resetVisualisationStore } = useVisualisationStore();

const { pathway } = storeToRefs(useVisualisationStore());

const fileFormat = ref<FileFormat>(FileFormat.PEPTIDE_LIST);
const filteredPathways = ref<any[]>([]);

const selectedArea = ref<any>(undefined);

resetSingleSampleStore();
resetVisualisationStore();

const onPathwaysFiltered = (pathways: any[]) => {
    filteredPathways.value = pathways;
};

watch(() => fileFormat.value, () => {
    resetSingleSampleStore();
    resetVisualisationStore();
});
</script>
