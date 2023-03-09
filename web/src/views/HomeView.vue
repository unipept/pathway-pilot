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
            <upload-view @submit="reset"/>
        </v-timeline-item>

        <v-timeline-item
            dot-color="primary"
            width="100%"
        >
            <template v-slot:icon>2</template>
            <pathway-selection-view />
        </v-timeline-item>

        <v-timeline-item
            dot-color="primary"
            width="100%"
        >
            <template v-slot:icon>3</template>
            <taxa-selection-view />
        </v-timeline-item>

        <v-timeline-item
            dot-color="primary"
            width="100%"
        >
            <template v-slot:icon>4</template>
            <visualisation-view />
        </v-timeline-item>
    </v-timeline>
</template>

<script setup lang="ts">
import UploadView from './stepper/UploadView.vue';
import PathwaySelectionView from './stepper/PathwaySelectionView.vue';
import TaxaSelectionView from './stepper/TaxaSelectionView.vue';
import VisualisationView from './stepper/VisualisationView.vue';
import useVisualisationStore from '@/stores/VisualisationStore';

const { reset } = useVisualisationStore();
</script>
