<template>
    <v-card elevation="5">
        <v-card-text v-if="hasItems" class="d-flex flex-wrap">
            <reaction-chip v-for="item of items"
                :key="item.name"
                class="chip flex-grow-1"
                :name="item.name" 
                color="green" 
            />
        </v-card-text>

        <v-card-text v-else
            class="d-flex justify-center align-center text-warning font-weight-bold"
        >
            <v-icon class="me-2">mdi-alert-outline</v-icon> There are no associated reactions to display.
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ReactionChip from '../chips/ReactionChip.vue';
import { ReactionTableItem } from './ReactionTableItem';

export interface Props {
    items: ReactionTableItem[]
};

const props = defineProps<Props>();

const hasItems = computed(() => props.items.length > 0);
</script>

<style scoped>
.chip {
    margin: 2px;
}
</style>
