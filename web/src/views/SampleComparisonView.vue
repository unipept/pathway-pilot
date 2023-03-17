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
            <upload-first-view @submit="resetVisualisationStore"/>
        </v-timeline-item>

        <v-timeline-item
            dot-color="primary"
        >
            <template v-slot:icon>2</template>
            <h2>Upload your second sample</h2>
            <upload-second-view @submit="resetVisualisationStore"/>
        </v-timeline-item>

        <v-timeline-item
            dot-color="primary"
            width="100%"
        >
            <template v-slot:icon>3</template>
            <h2>Select your pathway</h2>
            <pathway-selection-view />
        </v-timeline-item>

        <v-timeline-item
            dot-color="primary"
            width="100%"
        >
            <template v-slot:icon>4</template>
            <h2>Select your pathway</h2>
            <visualisation-view />
        </v-timeline-item>
    </v-timeline>
</template>

<script setup lang="ts">
import UploadFirstView from './multi-sample-stepper/UploadFirstView.vue';
import UploadSecondView from './multi-sample-stepper/UploadSecondView.vue';
import PathwaySelectionView from './multi-sample-stepper/PathwaySelectionView.vue';
import useVisualisationStore from '@/stores/VisualisationStore';
import VisualisationView from './multi-sample-stepper/VisualisationView.vue';
import useMultiSampleStore from '@/stores/MultiSampleStore';

const { reset: resetMultiSampleStore } = useMultiSampleStore();
const { reset: resetVisualisationStore } = useVisualisationStore();

resetMultiSampleStore();
resetVisualisationStore();
</script>
