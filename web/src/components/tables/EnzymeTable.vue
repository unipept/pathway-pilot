<template>
    <v-card elevation="5">
        <v-card-text v-if="hasItems" class="d-flex flex-wrap scrollable-overflow">
            <enzyme-chip v-for="item of items"
                :key="item.name"
                class="chip flex-grow-1"
                :name="item.name" 
                color="orange" 
            />
        </v-card-text>

        <v-card-text v-else
            class="d-flex justify-center align-center text-warning font-weight-bold"
        >
            <v-icon class="me-2">mdi-alert-outline</v-icon> There are no associated enzymes to display.
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import EnzymeChip from '../chips/EnzymeChip.vue';
import { EnzymeTableItem } from './EnzymeTableItem';

export interface Props {
    items: EnzymeTableItem[]
};

const props = defineProps<Props>();

const hasItems = computed(() => props.items.length > 0);
</script>

<style scoped>
.chip {
    margin: 2px;
}

.scrollable-overflow {
    max-height: 175px;
    overflow-y: auto;
}
</style>
