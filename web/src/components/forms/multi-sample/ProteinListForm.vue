<template>
    <protein-list-form
        :multi="true"
        @submit="onSubmit"
        @reset="onReset"
    />
</template>

<script setup lang="ts">
import ProteinListForm from '@/components/forms/single-sample/ProteinListForm.vue';

const emits = defineEmits(["submit", "reset"]);

const onSubmit = (inputList: string[], sampleName: string) => {
    emits("submit", inputList, sampleName);
};

const onReset = () => {
    emits("reset");
};
</script>
