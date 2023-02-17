<template>
    <v-card elevation="5">
        <v-card-text v-if="hasItems">
            <v-virtual-scroll :items="items" height="150">
                <template v-slot:default="{ item }">
                    <pathway-chip class="ma-1 chip" :name="item.name" color="blue" /> {{ item.description }}
                </template>
            </v-virtual-scroll>
        </v-card-text>

        <v-card-text v-else>
            <div class="error-container text-warning">
                <v-icon class="me-2 mb-1" size="30">mdi-alert-outline</v-icon>
                There are no associated modules to display.
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import PathwayChip from '../chips/PathwayChip.vue';
import { ModuleTableItem } from './ModuleTableItem';

export interface Props {
    items: ModuleTableItem[]
};

const props = defineProps<Props>();

const hasItems = computed(() => props.items.length > 0);
</script>

<style scoped>
.error-container {
    display: flex;
    flex-direction: column;
    height: 150px;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

:deep(.v-virtual-scroll__item):hover {
    background-color: #f4f4f4;
}

:deep(.v-virtual-scroll__item):hover .chip {
    background-color: #afcdeb;
    color: #337cbb !important;
}
</style>
