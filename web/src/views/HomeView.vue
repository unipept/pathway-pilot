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
            <upload-view @submit="() => resetSelection = !resetSelection"/>
        </v-timeline-item>
        <v-timeline-item
            dot-color="primary"
            width="100%"
        >
            <template v-slot:icon>2</template>
            <selection-view :do-reset="resetSelection"/>
        </v-timeline-item>
        <v-timeline-item
            dot-color="primary"
            width="100%"
        >
            <template v-slot:icon>3</template>
            <visualisation-view />
        </v-timeline-item>
    </v-timeline>
</template>

<script setup lang="ts">
import UploadView from './stepper/UploadView.vue';
import SelectionView from './stepper/SelectionView.vue';
import VisualisationView from './stepper/VisualisationView.vue';
import { ref } from 'vue';

const resetSelection = ref<boolean>(false);
</script>
