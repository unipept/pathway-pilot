<template>
    <v-card flat>
        <v-card-text>
            <upload-form
                label="Paste your protein list here"
                :loading="loading"
                :example="example"
                @submit="onSubmit"
                @reset="$emit('reset', $event)"
            />
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import UploadForm from '../UploadForm.vue';

import example from '../../examples/protein/ProteinListExample';

export interface Props {
    loading?: boolean;
}

withDefaults(defineProps<Props>(), {
    loading: false,
});

const emits = defineEmits(["submit", "reset"]);

const onSubmit = async (proteinList: string[], sampleName: string) => {
    emits("submit", proteinList, sampleName);
};
</script>
