<template>
    <h2>Upload your data</h2>
    <div class="mt-5">
        <p class="subtitle mb-3">
            First, we need to know the data you want to visualise. Van 't pathje offers multiple ways to upload your data. You can 
            either upload a <ResourceLink url="#">list of peptides</ResourceLink>  or a <ResourceLink url="#">list of proteins</ResourceLink>. 
            If you require more information about any of the input formats, we recommend you to look at the individual information tabs below.
        </p>

        <FormSelector @submit="$emit('submit')" />
    </div>
</template>

<script lang="ts" setup>
import FormSelector from '@/components/forms/FormSelector.vue';
import ResourceLink from '@/components/misc/ResourceLink.vue';

const emits = defineEmits(['submit']);
</script>

<style scoped>
.subtitle {
    color: #454545;
}
</style>
