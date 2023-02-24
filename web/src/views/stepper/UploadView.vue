<template>
    <h2>Upload your data</h2>
    <p>
        Van 't pathje offers multiple ways to upload your data. You can either upload a <a href="#">peptide list</a> or a <a href="#">protein list</a>. 
        You can also use the example data to get a feel for the tool.
    </p>
    <FormSelector />
</template>

<script lang="ts" setup>
import FormSelector from '@/components/forms/FormSelector.vue';
</script>
