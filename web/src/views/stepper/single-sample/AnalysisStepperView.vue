<template>
    <v-timeline-item dot-color="primary" width="100%">
        <template v-slot:icon>{{ step }}</template>
        <visualisation-view 
            v-model:area="selectedArea"
            v-model:compound="selectedCompound"
            :abundance="abundanceView"
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
            @click:filter="onFilter"
            @click:abundance="onAbundance"
        />
    </v-timeline-item>

    <v-dialog 
        v-model="filterModalOpen"
        max-width="75%"
        height="100%"
        @click:outside="filterModalOpen = false"
    >
        <taxon-filter-view />
    </v-dialog>
</template>

<script setup lang="ts">
import VisualisationView from './analysis/VisualisationView.vue';
import AdvancedAnalysisView from './analysis/AdvancedAnalysisView.vue';
import useVisualisationStore from '@/stores/VisualisationStore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import TaxonFilterView from './analysis/TaxonFilterView.vue';

export interface Props {
    step: number;
};

defineProps<Props>();

const { pathway, highlightedItems: highlightedTaxa } = storeToRefs(useVisualisationStore());

const selectedArea = ref<any>(undefined);
const selectedCompound = ref<any>(undefined);

const abundanceView = ref<boolean>(false);

const filterModalOpen = ref<boolean>(false);

const onAbundance = (value: boolean) => {
    abundanceView.value = value;
};

const onFilter = () => {
    filterModalOpen.value = true;
};
</script>
