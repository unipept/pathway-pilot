<template>
    <v-timeline density="compact" side="end" align="start">
        <upload-stepper-view    :step=1 @update:file-format="onFileFormatChanged" />
        <selection-stepper-view :step=2 @filtered="onPathwaysFiltered" />
        <analysis-stepper-view  :step=3 :file-format="fileFormat" />
        <export-stepper-view    :step=4 :filtered-pathways="filteredPathways" />
    </v-timeline>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import useVisualisationStore from '@/stores/VisualisationStore';
import useSingleSampleStore from '@/stores/sample/SingleSampleStore';
import UploadStepperView from './stepper/single-sample/UploadStepperView.vue';
import SelectionStepperView from './stepper/single-sample/SelectionStepperView.vue';
import AnalysisStepperView from './stepper/single-sample/AnalysisStepperView.vue';
import ExportStepperView from './stepper/single-sample/ExportStepperView.vue';
import FileFormat from './stepper/FileFormat';

useSingleSampleStore().reset();
useVisualisationStore().reset();

const fileFormat = ref<FileFormat>(FileFormat.PEPTIDE_LIST);

const filteredPathways = ref<any[]>([]);

const onPathwaysFiltered = (pathways: any[]) => {
    filteredPathways.value = pathways;
};

const onFileFormatChanged = (format: FileFormat) => {
    fileFormat.value = format;
};
</script>
