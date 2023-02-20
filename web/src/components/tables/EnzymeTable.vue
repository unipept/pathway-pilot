<template>
    <v-card elevation="5">
        <v-card-text v-if="hasItems" class="d-flex flex-wrap scrollable-overflow">
            <enzyme-chip v-for="item of items.slice(0, itemsToDisplay)"
                :key="item.name"
                class="chip flex-grow-1"
                :name="item.name" 
                color="orange" 
            />
            <show-more-chip v-if="items.length > itemsToDisplay"
                class="chip flex-grow-1" 
                @click="onShowMore" 
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
import { computed, ref } from 'vue';
import EnzymeChip from '../chips/EnzymeChip.vue';
import { EnzymeTableItem } from './EnzymeTableItem';
import ShowMoreChip from '../chips/ShowMoreChip.vue';

export interface Props {
    items: EnzymeTableItem[]
};

const props = defineProps<Props>();

const itemsToDisplay = ref<number>(50);

const hasItems = computed(() => props.items.length > 0);

const onShowMore = () => {
    itemsToDisplay.value += 50;
}
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
