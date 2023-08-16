<template>
    <div v-if="hasItems" class="scrollable-overflow">
        <div v-for="item of items.slice(0, itemsToDisplay)">
            <enzyme-chip
                :key="item.name"
                class="chip flex-grow-1"
                :name="item.name" 
                color="orange" 
            /> {{ item.description }}
        </div>

        <show-more-chip v-if="items.length > itemsToDisplay"
            class="chip flex-grow-1" 
            @click="onShowMore" 
        />
    </div>

    <div v-else-if="loading" class="loading-container">
        <v-progress-circular indeterminate color="secondary" />
    </div>

    <warning-alert v-else>
        There are no associated enzymes to display.
    </warning-alert>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import EnzymeChip from '../chips/EnzymeChip.vue';
import { EnzymeTableItem } from './EnzymeTableItem';
import ShowMoreChip from '../chips/ShowMoreChip.vue';
import WarningAlert from '../alerts/WarningAlert.vue';

export interface Props {
    items: EnzymeTableItem[]
    loading: boolean
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
    max-height: 150px;
    overflow-y: auto;
}

.loading-container {
    display: flex;
    flex-direction: column;
    height: 50px;
    justify-content: center;
    align-items: center;
}
</style>
