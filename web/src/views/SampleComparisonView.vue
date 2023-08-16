<template>
    <v-timeline density="compact" side="end" align="start">
        <upload-stepper-view    :step=1 />
        <selection-stepper-view :step=2 @filtered="onPathwaysFiltered" />
        <analysis-stepper-view  :step=3 />
        <export-stepper-view    :step=4 :filtered-pathways="filteredPathways" />
    </v-timeline>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import useVisualisationStore from '@/stores/VisualisationStore';
import useGroupSampleStore from '@/stores/sample/GroupSampleStore';
import UploadStepperView from './stepper/multi-sample/UploadStepperView.vue';
import SelectionStepperView from './stepper/multi-sample/SelectionStepperView.vue';
import AnalysisStepperView from './stepper/multi-sample/AnalysisStepperView.vue';
import ExportStepperView from './stepper/multi-sample/ExportStepperView.vue';

useGroupSampleStore().reset();
useVisualisationStore().reset();

const filteredPathways = ref<any[]>([]);

const onPathwaysFiltered = (pathways: any[]) => {
    filteredPathways.value = pathways;
};
</script>
