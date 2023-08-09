<template>
    <div class="legend-container">
        <span>{{ topItem.label }}</span>
        <div 
            class="legend my-1"
            :style="{
                backgroundImage: `linear-gradient(${topItem.color}, ${bottomItem.color})`
            }"
        ></div>
        <span>{{ bottomItem.label }}</span>
    </div>
</template>

<script setup lang="ts">
import { LegendItem } from './LegendItem';

export interface Props {
    topItem: LegendItem;
    bottomItem: LegendItem;
};

defineProps<Props>();
</script>

<style scoped>
.legend-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: fit-content;
    padding: 8px;
    position: absolute;
    right: 0;
    margin: 12px;
    font-size: 90%;
    background-color: white;
    z-index: 1;
}

.legend {
    width: 1.5em;
    height: 15em;
}
</style>
