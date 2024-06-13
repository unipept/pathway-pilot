<template>
    <v-timeline-item dot-color="primary" width="100%">
        <template v-slot:icon>{{ step }}</template>
        <export-view :pathways="filteredPathways" />
    </v-timeline-item>
</template>

<script setup lang="ts">
import ExportView from './export/ExportView.vue';

export interface Props {
    filteredPathways: any[];
    step: number;
};

defineProps<Props>();
</script>
