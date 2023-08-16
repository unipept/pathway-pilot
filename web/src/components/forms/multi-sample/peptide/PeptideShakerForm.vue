<template>
    <peptide-shaker-form
        :multi="true"
        @submit="onSubmit"
        @reset="onReset"
    />
</template>

<script setup lang="ts">
import PeptideShakerForm from '@/components/forms/single-sample/peptide/PeptideShakerForm.vue';

const emits = defineEmits(["submit", "reset"]);

const onSubmit = (inputList: string[], sampleName: string) => {
    emits("submit", inputList, sampleName);
};

const onReset = () => {
    emits("reset");
};
</script>
