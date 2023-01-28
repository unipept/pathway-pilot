<template>
    <div class="legend-container">
        <span v-if="title" class="text-h6">{{ title }}</span>
        <div class="d-flex" v-for="item in items">
            <v-icon :color="item.color">mdi-square</v-icon>
            <span class="ms-3">{{ item.label }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { LegendItem } from './LegendItem';

export interface Props {
    items: LegendItem[];

    title?: string;
};

defineProps<Props>();
</script>

<style scoped>
.legend-container {
    width: fit-content;
    border: 1px solid #000000;
    padding: 12px;
}
</style>
