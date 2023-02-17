<template>
    <v-card elevation="5">
        <v-card-text class="d-flex flex-wrap">
            <reaction-chip v-for="item of items"
                :key="item.name"
                class="chip flex-grow-1"
                :name="item.name" 
                color="green" 
            />
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import ReactionChip from '../chips/ReactionChip.vue';
import { ReactionTableItem } from './ReactionTableItem';

export interface Props {
    items: ReactionTableItem[]
};

defineProps<Props>();
</script>

<style scoped>
.chip {
    margin: 2px;
}
</style>
