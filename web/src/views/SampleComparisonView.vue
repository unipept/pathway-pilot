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
            <h2>Upload your first sample</h2>
            <upload-first-view @submit="reset"/>
        </v-timeline-item>

        <v-timeline-item
            dot-color="primary"
        >
            <template v-slot:icon>2</template>
            <h2>Upload your second sample</h2>
            <upload-second-view @submit="reset"/>
        </v-timeline-item>

        <v-timeline-item
            dot-color="primary"
        >
            <template v-slot:icon>2</template>
            <h2>Select your pathway</h2>
            <pathway-selection-view />
        </v-timeline-item>
    </v-timeline>
</template>

<script setup lang="ts">
import UploadFirstView from './multi-sample-stepper/UploadFirstView.vue';
import UploadSecondView from './multi-sample-stepper/UploadSecondView.vue';
import PathwaySelectionView from './multi-sample-stepper/PathwaySelectionView.vue';
import useVisualisationStore from '@/stores/VisualisationStore';

const { reset } = useVisualisationStore();
</script>
