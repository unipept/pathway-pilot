<template>
    <v-timeline-item dot-color="primary" width="100%">
        <template v-slot:icon>{{ step }}</template>
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
</template>

<script setup lang="ts">
import VisualisationView from './analysis/VisualisationView.vue';
import AdvancedAnalysisView from './analysis/AdvancedAnalysisView.vue';
import useVisualisationStore from '@/stores/VisualisationStore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

export interface Props {
    step: number;
};

defineProps<Props>();

const selectedArea = ref<any>(undefined);

const { pathway } = storeToRefs(useVisualisationStore());
</script>
