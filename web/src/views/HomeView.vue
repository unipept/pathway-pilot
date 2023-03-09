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
            <h2>Upload your data</h2>
            <upload-view @submit="reset"/>
        </v-timeline-item>

        <v-timeline-item
            dot-color="primary"
            width="100%"
        >
            <template v-slot:icon>2</template>
            <h2>Select your pathway</h2>
            <pathway-selection-view />
        </v-timeline-item>

        <v-timeline-item
            dot-color="primary"
            width="100%"
        >
            <template v-slot:icon>3</template>
            <h2>Select your taxa <span style="font-size: small; color: #7a7a7a;">OPTIONAL</span></h2>
            <taxa-selection-view />
        </v-timeline-item>

        <v-timeline-item
            dot-color="primary"
            width="100%"
        >
            <template v-slot:icon>4</template>
            <h2>Analyse your pathway</h2>
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
