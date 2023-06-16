<template>
    <v-card flat>
        <v-card-text class="information">
            <h4 class="mb-3">Upload a ProteomeDiscoverer file</h4>

            <upload-form
                label="Paste your ProteomeDiscoverer results here"
                :loading="loading"
                :example="example"
                @submit="$emit('submit', $event)"
                @reset="$emit('reset', $event)"
            />
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import UploadForm from '../UploadForm.vue';

import example from '../../examples/peptide/ProteomeDiscovererExample';

export interface Props {
    loading?: boolean;
}

withDefaults(defineProps<Props>(), {
    loading: false,
});

defineEmits(["submit", "reset"]);
</script>

<style scoped>
.information {
    padding: 0;
    font-size: 16px;
}
</style>
