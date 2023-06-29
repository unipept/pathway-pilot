<template>
    <proteome-discoverer-form
        :multi="true"
        @submit="onSubmit"
        @reset="onReset"
    />
</template>

<script setup lang="ts">
import ProteomeDiscovererForm from '@/components/forms/single-sample/peptide/ProteomeDiscovererForm.vue';

const emits = defineEmits(["submit", "reset"]);

const onSubmit = (inputList: string[], sampleName: string) => {
    emits("submit", inputList, sampleName);
};

const onReset = () => {
    emits("reset");
};
</script>
