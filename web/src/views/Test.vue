<template>
    <advanced-analysis-view :area="selectedArea" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import AdvancedAnalysisView from './sample-stepper/single-sample-stepper/advanced/AdvancedAnalysisView.vue';

const selectedArea = ref<any>(undefined);
</script>

<style scoped>

</style>
