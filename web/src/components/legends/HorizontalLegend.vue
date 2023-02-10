<template>
    <div v-if="!empty" class="legend-container">
        <span v-if="title" class="text-h6">{{ title }}</span>
        <v-row class="pa-3">
            <v-col v-for="item in items" class="pa-0" cols=4>
                <v-icon :color="item.color">mdi-square</v-icon>
                <span class="ms-3">{{ item.label }}</span>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { LegendItem } from './LegendItem';

export interface Props {
    items: LegendItem[];

    title?: string;
};

const props = defineProps<Props>();

const empty = computed(() => props.items.length === 0);
</script>

<style scoped>
.legend-container {
    border: 1px solid #000000;
    padding: 12px;
}
</style>
