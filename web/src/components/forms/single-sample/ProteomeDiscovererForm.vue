<template>
    <v-card flat>
        <v-card-text class="pa-0">
            <peptide-form
                label="Paste your Proteome Discoverer results here"
                :loading="loading"
                :example="example"
                @submit="e => $emit('submit', e)"
                @reset="e => $emit('reset', e)"
            />
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import PeptideForm from './PeptideForm.vue';

import example from '../examples/ProteomeDiscovererExample';

export interface Props {
    loading?: boolean;
}

withDefaults(defineProps<Props>(), {
    loading: false,
});

defineEmits(["submit", "reset"]);
</script>
