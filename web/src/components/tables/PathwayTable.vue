<template>
    <v-card elevation="5">
        <v-card-text>
            <v-virtual-scroll :items="items" height="150">
                <template v-slot:default="{ item }">
                    <pathway-chip class="ma-1 chip" :name="item.name" color="blue" /> {{ item.description }}
                </template>
            </v-virtual-scroll>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import PathwayChip from '../chips/PathwayChip.vue';

export interface Props {
    items: { name: string, description: string }[]
};

defineProps<Props>();
</script>

<style scoped>
:deep(.v-virtual-scroll__item):hover {
    background-color: #f4f4f4;
}

:deep(.v-virtual-scroll__item):hover .chip {
    background-color: #afcdeb;
    color: #337cbb !important;
}
</style>
