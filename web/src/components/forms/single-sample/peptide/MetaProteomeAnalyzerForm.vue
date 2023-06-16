<template>
    <v-card flat>
        <v-card-text class="pa-0">
            <upload-form
                label="Paste your Meta Proteome Analyzer results here"
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

import example from '../../examples/peptide/MetaProteomeAnalyzerExample';

export interface Props {
    loading?: boolean;
}

withDefaults(defineProps<Props>(), {
    loading: false,
});

defineEmits(["submit", "reset"]);
</script>
