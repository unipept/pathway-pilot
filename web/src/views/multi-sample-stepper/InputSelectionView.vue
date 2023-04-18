<template>
    <v-select
        class="mt-3 mb-n5"
        v-model="inputFormat"
        label="Select your input format"
        density="comfortable"
        :items="inputFormats"
        @update:model-value="e => $emit('update:model-value', e)"
    />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import FileFormat from '../FileFormat';

export interface Props {
    modelValue: FileFormat;
}

const props = defineProps<Props>();

defineEmits(['update:model-value']);

const inputFormat = ref<FileFormat>(props.modelValue);

const inputFormats = [
    FileFormat.PEPTIDE_LIST,
    FileFormat.PEPTIDE_SHAKER,
];

watch(() => props.modelValue, (newVal: FileFormat) => {
    inputFormat.value = newVal;
});
</script>
