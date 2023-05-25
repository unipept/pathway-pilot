<template>
    <AbundanceLegend :top-item="{ label: 'organism 1', color: '#75B9BE' }" :bottom-item="{ label: 'organism 2', color: '#ED9390' }" />

    <div v-for="color of colors">
        <div class="swatch" :style="{ backgroundColor: color }"></div>
    </div>
</template>

<script lang="ts" setup>
import Treeview from '@/components/visualisations/Treeview.vue';
import { TreeviewItem } from '@/components/visualisations/TreeviewItem';
import { ref } from 'vue';
import { useTaxonomyTree } from '@/composables/useTaxonomyTree';
import { computed } from 'vue';
import { watch } from 'vue';
import Tooltip from '@/components/misc/Tooltip.vue';
import AbundanceLegend from '@/components/legends/AbundanceLegend.vue';
import { useLinearGradient } from '@/composables/useLinearGradient';

const { getColor } = useLinearGradient('#75B9BE', '#ED9390');

const colors = computed(() => [
    getColor(0.0),
    getColor(0.1),
    getColor(0.2),
    getColor(0.3),
    getColor(0.4),
    getColor(0.5),
    getColor(0.6),
    getColor(0.7),
    getColor(0.8),
    getColor(0.9),
    getColor(1.0)
]);
</script>

<style scoped>
.swatch {
    width: 1.5em;
    height: 1.5em;
}
</style>
