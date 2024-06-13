<template>
    <v-timeline-item dot-color="primary" width="100%">
        <template v-slot:icon>{{ step }}</template>
        <visualisation-view 
            v-model:area="selectedArea" 
            v-model:compound="selectedCompound"
            :abundance="abundanceView"
            :file-format="fileFormat"
        />
    </v-timeline-item>

    <v-timeline-item v-if="pathway"
        dot-color="primary"
        size="20"
        fill-dot
        width="100%"
    >
        <advanced-analysis-view
            :area="selectedArea" 
            :compound="selectedCompound"
            @click:abundance="onAbundance"
        />
    </v-timeline-item>
</template>

<script setup lang="ts">
import VisualisationView from './analysis/VisualisationView.vue';
import AdvancedAnalysisView from './analysis/AdvancedAnalysisView.vue';
import useVisualisationStore from '@/stores/VisualisationStore';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import FileFormat from '../FileFormat';

export interface Props {
    step: number;
    fileFormat: FileFormat;
};

defineProps<Props>();

const { pathway } = storeToRefs(useVisualisationStore());

const selectedArea = ref<any>(undefined);
const selectedCompound = ref<any>(undefined);

const abundanceView = ref<boolean>(false);

const onAbundance = (value: boolean) => {
    abundanceView.value = value;
};

watch(pathway, () => {
    selectedArea.value = undefined;
    selectedCompound.value = undefined;
});
</script>
