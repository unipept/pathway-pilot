<template>
    <v-timeline-item dot-color="primary" width="100%">
        <template v-slot:icon>{{ step }}</template>
        <pathway-selection-view @filtered="onPathwaysFiltered" />
    </v-timeline-item>
</template>

<script setup lang="ts">
import PathwaySelectionView from './selection/PathwaySelectionView.vue';

export interface Props {
    step: number;
};

defineProps<Props>();

const emits = defineEmits(['filtered']);

const onPathwaysFiltered = (pathways: any[]) => {
    emits('filtered', pathways);
};
</script>
