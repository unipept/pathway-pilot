<template>
    <peptide-list-form
        :loading="processing"
        @submit="onSubmit"
    />
</template>

<script setup lang="ts">
import PeptideListForm from '@/components/forms/PeptideListForm.vue';
import PeptideListConverter from '@/logic/converters/PeptideListConverter';
import { ref } from 'vue';

const processing = ref<boolean>(false);

const peptideListConverter = new PeptideListConverter({
    onProgressUpdate: (progress) => {
        console.log(progress);
    }
});

const onSubmit = async (peptides: string[]) => {
    processing.value = true;

    const result = await peptideListConverter.convert(peptides);

    console.log(result);
    processing.value = false;
};
</script>

<style scoped>
svg {
    z-index: 1;
}

.pathway-container {
    position: relative;
    height: max-content;
}

.progress-loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
