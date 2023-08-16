<template>
    <max-quant-form
        :multi="true"
        @submit="onSubmit"
        @reset="onReset"
    />
</template>

<script setup lang="ts">
import MaxQuantForm from '@/components/forms/single-sample/peptide/MaxQuantForm.vue';

const emits = defineEmits(["submit", "reset"]);

const onSubmit = (inputList: string[], sampleName: string) => {
    emits("submit", inputList, sampleName);
};

const onReset = () => {
    emits("reset");
};
</script>
